CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  UNIQUE KEY uq_email_verify_hash(token_hash),
  KEY idx_email_verify_user(user_id,expires_at),
  CONSTRAINT fk_email_verify_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE candidate_profiles
  ADD COLUMN agency_approval_status ENUM('pending','needs_documents','approved','declined') NOT NULL DEFAULT 'pending' AFTER public_consent_at,
  ADD COLUMN agency_approval_note VARCHAR(500) NULL AFTER agency_approval_status,
  ADD COLUMN agency_reviewed_by BIGINT UNSIGNED NULL AFTER agency_approval_note,
  ADD COLUMN agency_reviewed_at DATETIME NULL AFTER agency_reviewed_by,
  ADD CONSTRAINT fk_candidate_agency_reviewer FOREIGN KEY(agency_reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

UPDATE users
SET email_verified_at=COALESCE(email_verified_at,created_at)
WHERE role IN ('candidate','employer');
