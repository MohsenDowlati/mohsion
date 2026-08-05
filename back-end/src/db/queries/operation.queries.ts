export const GET_NEXT_TASK_VERSION = `
SELECT COALESCE(MAX(version), 0) + 1 AS next_version
FROM operations
WHERE task_id = $1;
`;

export const CREATE_OPERATION = `
INSERT INTO operations (task_id, operation, version, user_id)
VALUES ($1, $2::jsonb, $3, $4)
RETURNING *;
`;

export const GET_OPERATIONS_BY_TASK = `
SELECT *
FROM operations
WHERE task_id = $1
ORDER BY version ASC;
`;