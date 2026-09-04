import {query} from '../../config/postgres.js';
import type {CreateShortLinkInput} from "./short-url.types.js";
import {CLICK_COUNT, CREATE_URL, DEACTIVATE_LINK, GET_BY_CODE} from "./short-url.queries.js";

export async function insertShortLink(
    input: CreateShortLinkInput & { code: string },
) {
    const result = await query(CREATE_URL, [
        input.code,
        input.type,
        input.destinationUrl,
        input.ownerId ?? null,
        input.invitationId ?? null,
        input.workspaceId ?? null,
        input.expiresAt ?? null,
    ]);

    return result.rows[0];
}

export async function findByCode(code: string) {
    const result = await query(
        GET_BY_CODE,
        [code],
    );

    return result.rows[0] ?? null;
}

export async function incrementClickCount(id: string | number) {
    await query(
    CLICK_COUNT,
        [id],
    );
}

export async function deactivateShortLink(id: string | number) {
    const result = await query(
       DEACTIVATE_LINK,
        [id],
    );

    return result.rows[0] ?? null;
}

