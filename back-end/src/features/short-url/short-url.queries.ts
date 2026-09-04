export const CREATE_URL = `
    INSERT INTO short_links (
        code,
        type,
        destination_url,
        owner_id,
        invitation_id,
        workspace_id,
        expires_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
        id,
        code,
        type,
        destination_url AS "destinationUrl",
        owner_id AS "ownerId",
        invitation_id AS "invitationId",
        workspace_id AS "workspaceId",
        is_active AS "isActive",
        expires_at AS "expiresAt",
        click_count AS "clickCount",
        created_at AS "createdAt";
`;

export const GET_BY_CODE = `
    SELECT
        id,
        code,
        type,
        destination_url AS "destinationUrl",
        owner_id AS "ownerId",
        invitation_id AS "invitationId",
        workspace_id AS "workspaceId",
        is_active AS "isActive",
        expires_at AS "expiresAt",
        click_count AS "clickCount",
        created_at AS "createdAt"
    FROM short_links
    WHERE code = $1
        LIMIT 1;
`;

export const CLICK_COUNT = `
    UPDATE short_links
    SET
        click_count = click_count + 1,
        updated_at = NOW()
    WHERE id = $1;
`;

export const DEACTIVATE_LINK = `
    UPDATE short_links
    SET
        is_active = FALSE,
        updated_at = NOW()
    WHERE id = $1
        RETURNING code;
`;
