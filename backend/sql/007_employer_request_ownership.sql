ALTER TABLE staffing_requests
  ADD COLUMN employer_user_id BIGINT UNSIGNED NULL AFTER id,
  ADD COLUMN approved_at DATETIME NULL AFTER status,
  ADD COLUMN approved_by BIGINT UNSIGNED NULL AFTER approved_at,
  ADD KEY idx_staffing_employer (employer_user_id, created_at),
  ADD CONSTRAINT fk_staffing_employer FOREIGN KEY (employer_user_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_staffing_approver FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

UPDATE staffing_requests sr
JOIN users u ON u.email=sr.email AND u.role='employer'
SET sr.employer_user_id=u.id
WHERE sr.employer_user_id IS NULL;
