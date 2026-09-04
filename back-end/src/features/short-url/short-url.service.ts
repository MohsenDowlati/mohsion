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
                shortUrl: `${process.env.PUBLIC_APP_URL}/s/${code}`,
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

export async function resolveShortLink(code: string) {
    const cached = await getShortLinkCache(code);

    if (cached) {
        return JSON.parse(<string>cached);
    }

    const link = await findByCode(code);

    if (!link) {
        return null;
    }

    const cacheTtl = calculateCacheTtl(link.expiresAt);

    await setShortLinkCache(code, link, cacheTtl);

    return link;
}

export async function registerClick(code: string) {
    await incrementClickCount(code);
}

export async function disableShortLink(code: string) {
    const link = await deactivateShortLink(code);

    if (!link) {
        return false;
    }

    await clearShortLinkCache(code);

    return true;
}
