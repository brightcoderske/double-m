ALTER TABLE reviews
  MODIFY COLUMN user_id BIGINT UNSIGNED NULL,
  ADD COLUMN reviewer_name VARCHAR(150) NULL AFTER user_id,
  ADD COLUMN publication_consent BOOLEAN NOT NULL DEFAULT FALSE AFTER review_text;

UPDATE reviews
SET publication_consent = TRUE
WHERE status = 'published';
