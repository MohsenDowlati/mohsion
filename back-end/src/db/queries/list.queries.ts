export const CREATE_LIST = `
INSERT INTO lists (workspace_id, title, position)
VALUES ($1, $2, $3)
RETURNING *;
`;

export const GET_LISTS_BY_WORKSPACE = `
SELECT *
FROM lists
WHERE workspace_id = $1
ORDER BY position ASC, id ASC;
`;

export const GET_LIST_WITH_WORKSPACE = `
SELECT id, workspace_id
FROM lists
WHERE id = $1;
`;

export const UPDATE_LIST = `
UPDATE lists
SET title = COALESCE($2, title),
    position = COALESCE($3, position)
WHERE id = $1
RETURNING *;
`;

export const DELETE_LIST = `
DELETE FROM lists
WHERE id = $1
RETURNING *;
`;