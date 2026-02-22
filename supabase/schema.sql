-- =============================================
-- Daily Report Generator - Supabase Schema
-- =============================================

-- Create the daily_reports table
CREATE TABLE daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL,
    activities JSONB NOT NULL,
    summary TEXT,
    full_report TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on report_date for faster queries
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date DESC);

-- Create index on created_at for sorting
CREATE INDEX idx_daily_reports_created ON daily_reports(created_at DESC);

-- Enable Row Level Security (optional - disable if not using auth)
-- ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

-- If you want public access without auth (for MVP):
-- CREATE POLICY "Enable read access for all users" ON daily_reports FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON daily_reports FOR INSERT WITH CHECK (true);

-- Sample query to verify table
-- SELECT id, report_date, created_at FROM daily_reports ORDER BY report_date DESC LIMIT 10;
