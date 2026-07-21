CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NULL,
  google_subject VARCHAR(255) NULL,
  role ENUM('candidate','employer','agency_staff','administrator') NOT NULL DEFAULT 'candidate',
  email_verified_at DATETIME NULL,
  status ENUM('pending','active','suspended') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_users_email (email), UNIQUE KEY uq_users_google_subject (google_subject), KEY idx_users_role_status (role,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS candidate_profiles (
  user_id BIGINT UNSIGNED NOT NULL, full_name VARCHAR(150) NOT NULL, phone VARCHAR(30) NOT NULL,
  profession VARCHAR(120) NOT NULL, location VARCHAR(160) NOT NULL, availability_status ENUM('available','available_from','placed','unavailable') NOT NULL DEFAULT 'available',
  profile_completion TINYINT UNSIGNED NOT NULL DEFAULT 20, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id), KEY idx_candidates_match (profession,location,availability_status), CONSTRAINT fk_candidate_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS consent_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,user_id BIGINT UNSIGNED NULL,subject_email VARCHAR(254) NOT NULL,consent_type VARCHAR(80) NOT NULL,consent_version VARCHAR(30) NOT NULL,granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,ip_hash CHAR(64) NULL,
  PRIMARY KEY(id),KEY idx_consent_subject(subject_email,consent_type),CONSTRAINT fk_consent_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS staffing_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,reference_code VARCHAR(24) NOT NULL,full_name VARCHAR(150) NOT NULL,phone VARCHAR(30) NOT NULL,email VARCHAR(254) NOT NULL,role_needed VARCHAR(120) NOT NULL,location VARCHAR(160) NOT NULL,requirements TEXT NOT NULL,preferred_contact ENUM('phone','email','whatsapp') NOT NULL,status ENUM('new','contacted','confirmed','matching','shortlisted','placed','closed','cancelled') NOT NULL DEFAULT 'new',created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id),UNIQUE KEY uq_staffing_reference(reference_code),KEY idx_staffing_status_created(status,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS jobs (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,reference_code VARCHAR(24) NOT NULL,title VARCHAR(180) NOT NULL,location VARCHAR(160) NOT NULL,employment_type VARCHAR(60) NOT NULL,description TEXT NOT NULL,status ENUM('draft','published','paused','closed','filled','expired','archived') NOT NULL DEFAULT 'draft',application_deadline DATETIME NULL,created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY(id),UNIQUE KEY uq_job_reference(reference_code),KEY idx_jobs_public(status,application_deadline,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS audit_logs (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,actor_user_id BIGINT UNSIGNED NULL,action VARCHAR(100) NOT NULL,entity_type VARCHAR(80) NOT NULL,entity_id VARCHAR(80) NULL,metadata JSON NULL,created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(id),KEY idx_audit_entity(entity_type,entity_id),KEY idx_audit_created(created_at),CONSTRAINT fk_audit_actor FOREIGN KEY(actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
