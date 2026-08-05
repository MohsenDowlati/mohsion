export const CREATE_USER = `
INSERT INTO users (name, password_hash)
VALUES ($1, $2)
RETURNING id, name, created_at;
`;

export const GET_USER_BY_NAME = `
SELECT id, name, password_hash, created_at
FROM users
WHERE name = $1;
`;

export const GET_USER_BY_ID = `
SELECT id, name, created_at
FROM users
WHERE id = $1;
`;