ALTER TABLE candidate_profiles
  ADD COLUMN public_profile_consent BOOLEAN NOT NULL DEFAULT FALSE AFTER profile_completion,
  ADD COLUMN public_consent_at DATETIME NULL AFTER public_profile_consent;

ALTER TABLE users
  MODIFY COLUMN status ENUM('pending','active','suspended','deleted') NOT NULL DEFAULT 'pending';
