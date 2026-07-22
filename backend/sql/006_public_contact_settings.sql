INSERT INTO site_settings(setting_key,setting_value)
VALUES
  ('contact_email','support@doublemagency.co.ke'),
  ('office_address','Kahawa West, Nairobi'),
  ('map_url',''),
  ('facebook_url',''),
  ('tiktok_url',''),
  ('youtube_url','')
ON DUPLICATE KEY UPDATE
  setting_value=CASE
    WHEN setting_key='contact_email' THEN 'support@doublemagency.co.ke'
    WHEN setting_key='office_address' AND (setting_value='' OR setting_value='Kenya') THEN 'Kahawa West, Nairobi'
    ELSE setting_value
  END;
