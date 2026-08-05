export const CREATE_TASK = `
INSERT INTO tasks (list_id, title, description, position, completed, priority, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
`;

export const GET_TASKS_BY_LIST = `
SELECT *
FROM tasks
WHERE list_id = $1
ORDER BY position ASC, id ASC;
`;

export const GET_TASKS_BY_WORKSPACE = `
SELECT t.*
FROM tasks t
JOIN lists l ON l.id = t.list_id
WHERE l.workspace_id = $1
ORDER BY l.position ASC, t.position ASC, t.id ASC;
`;

export const UPDATE_TASK = `
UPDATE tasks
SET list_id = COALESCE($2, list_id),
    title = COALESCE($3, title),
    description = COALESCE($4, description),
    position = COALESCE($5, position),
    completed = COALESCE($6, completed),
    priority = COALESCE($7, priority),
    updated_at = NOW()
WHERE id = $1
RETURNING *;
`;

export const DELETE_TASK = `
DELETE FROM tasks
WHERE id = $1
RETURNING *;
`;

export const GET_TASK_WITH_WORKSPACE = `
SELECT t.*, l.workspace_id
FROM tasks t
JOIN lists l ON l.id = t.list_id
WHERE t.id = $1;
`;
