CREATE TABLE IF NOT EXISTS submissions (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    phone       VARCHAR(30)   NOT NULL,
    email       VARCHAR(255)  NOT NULL,
    message     TEXT          NOT NULL,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at DESC);
