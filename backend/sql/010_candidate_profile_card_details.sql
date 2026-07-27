ALTER TABLE candidate_private_details
  ADD COLUMN county VARCHAR(100) NULL AFTER education_level,
  ADD COLUMN languages VARCHAR(250) NULL AFTER county,
  ADD COLUMN experience_summary VARCHAR(250) NULL AFTER languages,
  ADD COLUMN skills_summary VARCHAR(500) NULL AFTER experience_summary;
