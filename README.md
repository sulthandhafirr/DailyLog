# Daily Report Generator

A professional daily work report generator powered by AI (DeepSeek) with persistent storage and export capabilities.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **AI Provider:** DeepSeek (OpenAI-compatible API)
- **Database:** Supabase (PostgreSQL)
- **Export:** docx, pdfkit
- **Styling:** Pure CSS

## Features

### Core Features (Phase 1)
- ✅ AI-generated professional reports
- ✅ Manual activity input (time + description)
- ✅ Automatic summary at 06:00 PM
- ✅ No hallucinations - strictly uses provided data
- ✅ Copy to clipboard & download as .txt

### New in Phase 2
- ✅ **Persistent Storage** - Reports saved to Supabase
- ✅ **Report History** - View all previously generated reports
- ✅ **Word Export** - Download reports as .docx files
- ✅ **PDF Export** - Download reports as PDF files
- ✅ **Report Details** - View individual report with metadata

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **DeepSeek:** Get your API key from [DeepSeek's platform](https://platform.deepseek.com/)  
> **Supabase:** See [PHASE2-SETUP.md](PHASE2-SETUP.md) for detailed Supabase setup

### 3. Setup Supabase Database

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. In SQL Editor, run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key to `.env.local`

See [PHASE2-SETUP.md](PHASE2-SETUP.md) for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Generate a Report

1. Enter the date (e.g., "February 15, 2026")
2. Add activities with time (e.g., "09:00 AM") and description
3. Click "Generate Report"
4. Report is displayed and automatically saved to database
5. Export using any available format

### View History

Generates and saves a daily report.

**Request Body:**
```json
{
  "date": "February 15, 2026",
  "activities": [
    {
      "time": "09:00 AM",
      "description": "Team standup meeting"
    },
    {
      "time": "10:30 AM",
      "description": "Code review for PR #123"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "report": "Daily Report – February 15, 2026\n\n09:00 AM – Team standup meeting\n...",
  "reportId": "uuid-of-saved-report"
}
```

### GET `/api/reports`

Fetches all saved reports.

### GET `/api/reports/[id]`

Fetches a specific report by ID.

### GET `/api/export/docx/[id]`

Exports report as Word document.

### GET `/api/export/pdf/[id]`

Exports report as PDF document.   "time": "09:00 AM",
      "description": "Team standup meeting"
    },
    {
      "time": "10:30 AM",
      "description": "Code review for PR #123"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "report": "Daily Report – February 15, 2026\n\n09:00 AM – Team standup meeting\n..."
}
```

## Project Structure

```
daily-report/
├── app/
│   ├── api/generate-report/route.ts    # AI API endpoint
│   ├── page.tsx                         # Main page
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Styles
├── components/
│   ├── ReportForm.tsx                   # Input form
│   └── ReportDisplay.tsx                # Output display
├── lib/
│   ├── types.ts                         # TypeScript types
│   └── prompts.ts                       # AI prompt templates
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Key Design Decisions

1. **Stateless AI Generation:** Each report generated once by AI, then stored
2. **Database Storage:** Supabase for persistent, queryable storage
3. **Export Strategy:** Use stored text, no AI regeneration on export
4. **Single API Route:** One endpoint handles generation and save
5. **Strict Prompting:** System prompt enforces rules to prevent hallucinations
6. **Temperature 0.3:** Low temperature for consistent, predictable output
7. **Direct Export:** Word and PDF generated on-demand from stored reports

## Future Enhancements (Phase 3)

- [ ] User authentication (Supabase Auth)
- [ ] Personal report history (isolated by user)
- [ ] Report templates
- [ ] Search and filter history
- [ ] Edit saved reports
- [ ] Report analytics and trends
- [ ] Team collaboration features
- [ ] Custom branding/styling

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick setup guide
- **[PHASE2-SETUP.md](PHASE2-SETUP.md)** - Detailed Phase 2 setup
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - AI prompting strategy
- **[API-TESTING.md](API-TESTING.md)** - API testing examples

## License

MIT
