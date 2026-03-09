# Daily Report Generator

An AI-powered professional daily work report generator with persistent storage, history tracking, and export capabilities.

## Features

- AI-generated professional reports using DeepSeek
- Manual activity input with time and description
- Automatic summary generation at 06:00 PM
- Report history with full CRUD operations
- Export to PDF and DOCX formats
- Email report functionality
- Dark mode support
- Responsive design (mobile-first)
- Edit existing reports

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **AI:** DeepSeek (OpenAI-compatible API)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Export:** pdfkit, docx

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Supabase

Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-report/route.ts    # AI generation endpoint
│   │   ├── reports/                    # CRUD endpoints
│   │   └── export/                     # PDF/DOCX export
│   ├── history/                        # Report history pages
│   ├── page.tsx                        # Main generator page
│   └── layout.tsx                      # Root layout
├── components/
│   ├── ReportForm.tsx                  # Input form component
│   ├── ReportDisplay.tsx               # Report output display
│   ├── EmailModal.tsx                  # Email send modal
│   └── DarkModeToggle.tsx              # Theme switcher
├── lib/
│   ├── types.ts                        # TypeScript types
│   ├── prompts.ts                      # AI prompt templates
│   ├── supabase.ts                     # Database client
│   └── dateUtils.ts                    # Date utilities
└── supabase/
    └── schema.sql                      # Database schema
```

## API Routes

### POST `/api/generate-report`
Generate AI report from activities

**Body:**
```json
{
  "date": "February 15, 2026",
  "activities": [
    { "time": "09:00 AM", "description": "Team meeting" }
  ]
}
```

### POST `/api/reports/save`
Save report to database

### GET `/api/reports`
Fetch all reports

### GET `/api/reports/[id]`
Fetch specific report

### DELETE `/api/reports/[id]`
Delete report

### GET `/api/export/pdf/[id]`
Export report as PDF

### GET `/api/export/docx/[id]`
Export report as DOCX

### POST `/api/reports/email`
Send report via email

## Key Design Decisions

1. **Webpack over Turbopack:** Uses webpack for PDF generation library compatibility
2. **Server Externals:** PDF dependencies externalized to prevent bundling issues
3. **Stateless AI:** Reports generated once, then stored
4. **Strict Prompting:** AI constrained to prevent hallucinations (temperature 0.3)
5. **Mobile-First:** Responsive design prioritizes mobile UX
6. **Dark Mode:** System preference detection with manual toggle

## AI Prompting

The system uses structured prompts to ensure accurate report generation:

**System Rules:**
- Never modify user-provided times or descriptions
- Never infer or add new activities
- Summary always at 06:00 PM
- Professional workplace language only

**Output Format:**
```
Daily Report – [DATE]

[TIME] – [DESCRIPTION]
[TIME] – [DESCRIPTION]

06:00 PM – Summary of today
- Key accomplishments
- Major tasks completed
```

See `lib/prompts.ts` for implementation details.

## Deployment (Vercel)

### Prerequisites
- Vercel account
- Supabase database
- DeepSeek API key

### Steps

1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables:
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Build Configuration

Already configured in `vercel.json`:
```json
{
  "buildCommand": "next build --webpack"
}
```

### Troubleshooting

**Build Error: Turbopack/Webpack Conflict**
- Ensure `vercel.json` has `--webpack` flag
- Check `next.config.ts` has proper externals

**PDF Export Fails**
- Verify `serverExternalPackages` in `next.config.ts`
- Check build uses webpack

**Database Connection**
- Verify Supabase URL format (https://xxx.supabase.co)
- Use anon key, not service key

## Development

### Code Style
- TypeScript strict mode enabled
- Clean, minimal comments
- Lucide React for all icons
- Tailwind for styling

### Component Guidelines
- Use 'use client' for interactive components
- Mobile-first responsive design
- Dark mode classes on all components
- Proper loading and error states

## Future Enhancements

- User authentication (Supabase Auth)
- Multi-user support with user isolation
- Report templates
- Search and filter functionality
- Report analytics dashboard
- Team collaboration features
- Batch export
- Scheduled email reports

## License

MIT
