CREATE
EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    name TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW
(
)
    );

CREATE TABLE IF NOT EXISTS workspaces
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES users
(
    id
) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW
(
)
    );

CREATE TABLE IF NOT EXISTS workspace_members
(
    workspace_id
    UUID
    NOT
    NULL
    REFERENCES
    workspaces
(
    id
) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users
(
    id
)
  ON DELETE CASCADE,
    role TEXT NOT NULL CHECK
(
    role
    IN
(
    'owner',
    'editor',
    'viewer'
)),
    PRIMARY KEY
(
    workspace_id,
    user_id
)
    );

CREATE TABLE IF NOT EXISTS lists
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    workspace_id UUID NOT NULL REFERENCES workspaces
(
    id
) ON DELETE CASCADE,
    title TEXT NOT NULL,
    position INT NOT NULL DEFAULT 0
    );

CREATE TABLE IF NOT EXISTS tasks
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    list_id UUID NOT NULL REFERENCES lists
(
    id
) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INT NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority TEXT NOT NULL CHECK
(
    priority
    IN
(
    'low',
    'medium',
    'high'
)),
    created_by UUID NOT NULL REFERENCES users
(
    id
)
  ON DELETE RESTRICT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW
(
)
    );

CREATE INDEX IF NOT EXISTS lists_workspace_position_idx
    ON lists (workspace_id, position, id);

CREATE INDEX IF NOT EXISTS tasks_list_position_idx
    ON tasks (list_id, position, id);

CREATE TABLE IF NOT EXISTS operations
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    task_id UUID NOT NULL REFERENCES tasks
(
    id
) ON DELETE CASCADE,
    operation JSONB NOT NULL,
    version INT NOT NULL,
    user_id UUID NOT NULL REFERENCES users
(
    id
)
  ON DELETE RESTRICT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW
(
),
    UNIQUE
(
    task_id,
    version
)
    );

CREATE TYPE short_link_type AS ENUM (
  'INVITATION',
  'WORKSPACE'
);

CREATE TABLE short_links
(
    id              BIGSERIAL PRIMARY KEY,

    code            VARCHAR(16)     NOT NULL UNIQUE,

    type            short_link_type NOT NULL,

    destination_url TEXT            NOT NULL,

    owner_id        UUID NULL,

    invitation_id   UUID NULL,
    workspace_id    UUID NULL,

    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,

    expires_at      TIMESTAMPTZ NULL,

    click_count     BIGINT          NOT NULL DEFAULT 0,

    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_short_links_code
    ON short_links (code);

CREATE INDEX idx_short_links_owner_id
    ON short_links (owner_id);

CREATE INDEX idx_short_links_invitation_id
    ON short_links (invitation_id);

CREATE INDEX idx_short_links_workspace_id
    ON short_links (workspace_id);