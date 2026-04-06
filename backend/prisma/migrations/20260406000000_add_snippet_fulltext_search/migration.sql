-- Add a generated tsvector column for full-text search across title, description, and code
ALTER TABLE "Snippet"
  ADD COLUMN IF NOT EXISTS "search_vector" tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
      setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("code", '')), 'C')
    ) STORED;

-- Create a GIN index on the generated column for fast full-text search
CREATE INDEX IF NOT EXISTS "Snippet_search_vector_idx"
  ON "Snippet" USING GIN ("search_vector");
