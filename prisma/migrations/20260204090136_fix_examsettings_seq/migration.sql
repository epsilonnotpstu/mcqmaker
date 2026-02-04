-- Ensure ExamSettings id sequence matches current max(id)
DO $$
DECLARE
	max_id INTEGER;
BEGIN
	SELECT COALESCE(MAX("id"), 0) INTO max_id FROM "ExamSettings";
	PERFORM setval('examsettings_id_seq', max_id);
END $$;