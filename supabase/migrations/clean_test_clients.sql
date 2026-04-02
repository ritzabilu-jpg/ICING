-- צפה קודם מה יימחק:
-- SELECT id, name, phone, created_at FROM clients
-- WHERE LENGTH(name) < 3
--    OR phone ~ '^[0-9]{1,5}$'
--    OR name ~ '^[0-9]+$';

-- מחק נתוני test:
DELETE FROM clients
WHERE LENGTH(name) < 3
   OR phone ~ '^[0-9]{1,5}$'
   OR name ~ '^[0-9]+$';
