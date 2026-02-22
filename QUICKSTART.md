# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- OpenAI SDK (for DeepSeek API)

### Step 2: Configure API Key

Create a `.env.local` file in the root directory:

```env
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

**Where to get your API key:**
1. Go to [https://platform.deepseek.com/](https://platform.deepseek.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

### Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📝 How to Use

1. **Enter Date:** Type the date (e.g., "February 15, 2026")

2. **Add Activities:**
   - Time: Enter in format like "09:00 AM" or "2:30 PM"
   - Description: Describe what you did

3. **Add More Activities:** Click "+ Add Activity" button

4. **Generate Report:** Click "Generate Report" button

5. **Export Report:**
   - Click "Copy to Clipboard" to paste into Word/Docs
   - Click "Download as .txt" for a text file
   - Paste into Microsoft Word or Google Docs
   - Export as .docx or PDF from there

---

## ✅ Expected Output Format

```
Daily Report – February 15, 2026

09:00 AM – Team standup meeting
11:00 AM – Code review for authentication module
02:30 PM – Client meeting about project requirements

06:00 PM – Summary of today
- Participated in daily team standup to align on sprint progress
- Conducted thorough code review for the authentication module
- Met with client to discuss and clarify project requirements
```

---

## 🔧 Troubleshooting

### "DeepSeek API key not configured"
- Ensure `.env.local` file exists in the root directory
- Verify the file contains `DEEPSEEK_API_KEY=...`
- Restart the development server after adding the file

### TypeScript Errors Before Installation
- Run `npm install` first
- These errors disappear after dependencies are installed

### Port 3000 Already in Use
```bash
# Run on a different port
npm run dev -- -p 3001
```

### Network Errors
- Check your internet connection
- Verify your API key is valid and has credits
- Check DeepSeek API status

---

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 🎯 Key Features

✅ **No Database Required** - Completely stateless  
✅ **No Authentication** - Open for immediate use  
✅ **AI-Powered** - Professional summaries via DeepSeek  
✅ **Accurate** - Never modifies your input  
✅ **Clean Output** - Ready for Word/PDF export  
✅ **Fast** - Single API call per report  

---

## 📚 Additional Documentation

- [README.md](README.md) - Full project documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - AI prompting strategy and technical details

---

## 🆘 Need Help?

Common issues and solutions:

**Issue:** Activities not showing up in report  
**Solution:** Ensure both time AND description are filled for each activity

**Issue:** Summary doesn't appear  
**Solution:** The AI always adds it at 06:00 PM - this is automatic

**Issue:** Report format looks wrong  
**Solution:** The AI follows strict formatting rules. If issues persist, check your API key and model name in the code

---

## 💡 Tips

1. **Time Format:** Use standard formats like "09:00 AM" or "2:30 PM"
2. **Descriptions:** Be specific - better summaries come from clear descriptions
3. **Breaks:** Only include breaks if they're important to mention
4. **Order:** Add activities in chronological order for best results
5. **Summary:** The 06:00 PM summary is automatic - don't add it manually

---

## 🔄 Next Steps (Future)

After this MVP, you can add:
- Database (Supabase) for saving reports
- User authentication
- Report history
- Multiple templates
- Direct .docx/.pdf export
- Team collaboration features

But for now, keep it simple! This MVP covers the core functionality perfectly.
