-- Step 1: מחק רשומות כפולות, שמור את זו עם max_participants הגבוה
DELETE FROM immersion_slots
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY slot_date, slot_time, instructor_id
             ORDER BY max_participants DESC, created_at ASC
           ) as rn
    FROM immersion_slots
  ) ranked
  WHERE rn > 1
);

-- Step 2: הוסף unique constraint למניעת כפילויות בעתיד
ALTER TABLE immersion_slots
ADD CONSTRAINT unique_slot_per_instructor
UNIQUE (slot_date, slot_time, instructor_id);
