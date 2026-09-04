import { createShortCode } from "../../utils/short-code.js";
import {
    deactivateShortLink,
    findByCode,
    incrementClickCount,
    insertShortLink,
} from "./short-url.repository.js";
import type {CreateShortLinkInput} from "./short-url.types.js";
import {calculateCacheTtl} from "../../utils/cacheHelper.js";
import {clearShortLinkCache, getShortLinkCache, setShortLinkCache} from "./short-url.cache.js";
import {SHORT_URL_BASE_URL} from "../../config/env.js";
import type {ShortLink} from "./short-url.types.js";


export async function createShortLink(input: CreateShortLinkInput) {
    let attempts = 0;

    while (attempts < 5) {
        attempts++;

        const code = createShortCode();

        try {
            const link = await insertShortLink({
                ...input,
                code,
            });

            const cacheTtl = calculateCacheTtl(input.expiresAt);

            await setShortLinkCache(code,{
                id: link.id,
                code: link.code,
                destinationUrl: link.destinationUrl,
                isActive: link.isActive,
                expiresAt: link.expiresAt,
            },
                cacheTtl)


            return {
                ...link,
                shortUrl: `${SHORT_URL_BASE_URL.replace(/\/$/, "")}/s/${code}`,
            };
        } catch (error: any) {
            if (error.code === "23505") {
                continue;
            }

            throw error;
        }
    }

    throw new Error("Could not generate a unique short code");
}

export async function resolveShortLink(code: string): Promise<ShortLink | null> {
    // 1. Check Redis Cache
    const cached = await getShortLinkCache(code);
    if (cached) {
        const link = (typeof cached === "string" ? JSON.parse(cached) : cached) as ShortLink;
        return link;
    }

    // 2. Query Postgres
    const link = await findByCode(code);
    if (!link) {
        return null;
    }

    // Cache the record; the controller owns status/error semantics.
    const cacheTtl = calculateCacheTtl(link.expiresAt);
    if (cacheTtl > 0) {
        await setShortLinkCache(code, JSON.stringify(link), cacheTtl);
    }

    return link as ShortLink;
}


export async function registerClick(id: string | number) {
    await incrementClickCount(id);
}

export async function disableShortLink(id: string | number) {
    const link = await deactivateShortLink(id);

    if (!link) {
        return false;
    }

    await clearShortLinkCache(link.code);

    return true;
}
