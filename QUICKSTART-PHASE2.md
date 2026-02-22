# 🚀 Phase 2 Quick Setup

## Prerequisites
- Node.js installed
- Supabase account (free tier works)
- DeepSeek API key

## Setup in 5 Minutes

### Step 1: Install Dependencies (1 min)

```bash
npm install
```

This installs:
- Supabase client
- docx (Word export)
- pdfkit (PDF export)

### Step 2: Setup Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) and create a project
2. In SQL Editor, paste and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from Settings → API

### Step 3: Configure Environment (30 sec)

Create/update `.env.local`:

```env
# DeepSeek API
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# Supabase (get from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 4: Run (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Test (1 min)

1. Generate a report
2. See "Saved!" message and export buttons
3. Click "View History" → See your report
4. Export as .docx or PDF

---

## ✅ What's New

- 📦 **Database** - Reports saved to PostgreSQL
- 📜 **History** - View all past reports
- 📄 **Word Export** - Download as .docx
- 📑 **PDF Export** - Download as PDF
- 🔗 **Direct Links** - Share specific reports

---

## 🎯 Quick Navigation

**Main App:**
- `/` - Generate new report
- `/history` - View all reports
- `/history/[id]` - View specific report

**API Endpoints:**
- `POST /api/generate-report` - Generate & save
- `GET /api/reports` - List all reports
- `GET /api/reports/[id]` - Get one report
- `GET /api/export/docx/[id]` - Export Word
- `GET /api/export/pdf/[id]` - Export PDF

---

## 📚 Need More Details?

- **Setup Issues:** See [PHASE2-SETUP.md](PHASE2-SETUP.md)
- **Implementation:** See [PHASE2-SUMMARY.md](PHASE2-SUMMARY.md)
- **API Testing:** See [API-TESTING.md](API-TESTING.md)
- **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🐛 Troubleshooting

**"Missing Supabase environment variables"**
→ Check `.env.local` exists and has both Supabase vars

**"Failed to save to database"**
→ Run `supabase/schema.sql` in Supabase SQL Editor

**Module not found errors**
→ Run `npm install` again

**Port 3000 in use**
→ Run `npm run dev -- -p 3001`

---

## 🎉 You're Ready!

Generate reports, view history, and export in professional formats.

Next: Add authentication in Phase 3!
