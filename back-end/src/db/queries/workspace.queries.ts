export const CREATE_WORKSPACE = `
INSERT INTO workspaces (name, owner_id)
VALUES ($1, $2)
RETURNING *;
`;

export const ADD_WORKSPACE_MEMBER = `
INSERT INTO workspace_members (workspace_id, user_id, role)
VALUES ($1, $2, $3)
ON CONFLICT (workspace_id, user_id) DO UPDATE
SET role = CASE
  WHEN workspace_members.role = 'owner' THEN workspace_members.role
  ELSE EXCLUDED.role
END
RETURNING *;
`;

export const GET_WORKSPACES_FOR_USER = `
SELECT w.*, wm.role AS my_role
FROM workspaces w
JOIN workspace_members wm ON wm.workspace_id = w.id
WHERE wm.user_id = $1
ORDER BY w.created_at DESC;
`;

export const GET_WORKSPACE_FOR_USER = `
SELECT w.*, wm.role AS my_role
FROM workspaces w
JOIN workspace_members wm ON wm.workspace_id = w.id
WHERE w.id = $1 AND wm.user_id = $2;
`;

export const GET_WORKSPACE_MEMBERSHIP = `
SELECT workspace_id, user_id, role
FROM workspace_members
WHERE workspace_id = $1 AND user_id = $2;
`;
