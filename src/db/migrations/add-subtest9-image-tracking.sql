-- Migration: Add tracking for Subtest 9 image access
-- For IST Subtest 9 memorization system

-- Add columns to ist_subtest_sessions table for image access tracking
ALTER TABLE ist_subtest_sessions 
ADD COLUMN IF NOT EXISTS subtest_9_image_viewed_at TIMESTAMP WITHOUT TIME ZONE,
ADD COLUMN IF NOT EXISTS subtest_9_image_remaining_time INTEGER DEFAULT 180;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ist_subtest_sessions_subtest9_viewed 
ON ist_subtest_sessions(ist_invitation_id, subtest_template_id, subtest_9_image_viewed_at)
WHERE subtest_template_id = '9';

-- Optional: Create audit table for detailed tracking
-- CREATE TABLE IF NOT EXISTS subtest_9_image_access_journal (
--   id SERIAL PRIMARY KEY,
--   ist_invitation_id TEXT NOT NULL,
--   subtest_template_id TEXT NOT NULL,
--   viewed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
--   remaining_time_at_access INTEGER
-- );

-- Optional: Indexes for audit table
-- CREATE INDEX IF NOT EXISTS idx_subtest9_access_invitation 
-- ON subtest_9_image_access_journal(ist_invitation_id, subtest_template_id);