# API Testing Guide

Test the API endpoint directly using these examples.

## Endpoint

```
POST http://localhost:3000/api/generate-report
```

---

## Example 1: Basic Report

### Request

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
      "description": "Code review for authentication module"
    },
    {
      "time": "02:00 PM",
      "description": "Client meeting to discuss requirements"
    }
  ]
}
```

### Expected Response (Success)

```json
{
  "success": true,
  "report": "Daily Report – February 15, 2026\n\n09:00 AM – Team standup meeting\n10:30 AM – Code review for authentication module\n02:00 PM – Client meeting to discuss requirements\n\n06:00 PM – Summary of today\n- Participated in team standup meeting to align on daily objectives\n- Conducted code review for authentication module implementation\n- Met with client to discuss and clarify project requirements"
}
```

---

## Example 2: Full Day Schedule

### Request

```json
{
  "date": "March 1, 2026",
  "activities": [
    {
      "time": "08:30 AM",
      "description": "Reviewed emails and prioritized tasks"
    },
    {
      "time": "09:00 AM",
      "description": "Sprint planning meeting"
    },
    {
      "time": "10:30 AM",
      "description": "Implemented user registration API endpoint"
    },
    {
      "time": "12:00 PM",
      "description": "Lunch break"
    },
    {
      "time": "01:00 PM",
      "description": "Fixed bug in payment processing module"
    },
    {
      "time": "03:00 PM",
      "description": "Pair programming session with junior developer"
    },
    {
      "time": "04:30 PM",
      "description": "Updated project documentation"
    }
  ]
}
```

### Expected Response

The AI will generate a report with all 7 activities plus a summary at 06:00 PM.

---

## Example 3: Validation Error - Missing Date

### Request

```json
{
  "activities": [
    {
      "time": "09:00 AM",
      "description": "Team meeting"
    }
  ]
}
```

### Expected Response (Error)

```json
{
  "success": false,
  "error": "Date and at least one activity are required"
}
```

**Status Code:** 400

---

## Example 4: Validation Error - Empty Activities

### Request

```json
{
  "date": "February 15, 2026",
  "activities": []
}
```

### Expected Response (Error)

```json
{
  "success": false,
  "error": "Date and at least one activity are required"
}
```

**Status Code:** 400

---

## Example 5: Validation Error - Missing Activity Fields

### Request

```json
{
  "date": "February 15, 2026",
  "activities": [
    {
      "time": "09:00 AM"
    }
  ]
}
```

### Expected Response (Error)

```json
{
  "success": false,
  "error": "Each activity must have a time and description"
}
```

**Status Code:** 400

---

## Testing with cURL

### Basic Test

```bash
curl -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "date": "February 15, 2026",
    "activities": [
      {
        "time": "09:00 AM",
        "description": "Team meeting"
      },
      {
        "time": "02:00 PM",
        "description": "Code review"
      }
    ]
  }'
```

### Pretty Print JSON Response

```bash
curl -X POST http://localhost:3000/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "date": "February 15, 2026",
    "activities": [
      {"time": "09:00 AM", "description": "Team meeting"},
      {"time": "02:00 PM", "description": "Code review"}
    ]
  }' | jq '.'
```

---

## Testing with PowerShell

```powershell
$body = @{
    date = "February 15, 2026"
    activities = @(
        @{
            time = "09:00 AM"
            description = "Team standup meeting"
        },
        @{
            time = "02:00 PM"
            description = "Client presentation"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/generate-report" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

---

## Testing with Postman

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/generate-report`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "date": "February 15, 2026",
     "activities": [
       {
         "time": "09:00 AM",
         "description": "Team standup meeting"
       }
     ]
   }
   ```

---

## Response Status Codes

| Status | Meaning | When It Happens |
|--------|---------|-----------------|
| 200 | Success | Report generated successfully |
| 400 | Bad Request | Invalid input (missing date, empty activities, etc.) |
| 500 | Server Error | API key missing, DeepSeek API failure, network error |

---

## Common API Errors

### Error: "DeepSeek API key not configured"

**Cause:** `.env.local` file missing or `DEEPSEEK_API_KEY` not set

**Solution:**
1. Create `.env.local` in root directory
2. Add: `DEEPSEEK_API_KEY=your_key_here`
3. Restart dev server

### Error: "No report generated by AI"

**Cause:** DeepSeek API returned empty response

**Solution:**
- Check API key validity
- Verify API has credits/quota
- Check network connectivity
- Try again

### Error: "Failed to generate report"

**Cause:** Network error or API timeout

**Solution:**
- Check internet connection
- Verify DeepSeek API status
- Retry request

---

## Testing Checklist

Use this checklist to verify the system works correctly:

- [ ] **Valid Input:** Submit complete report → Get formatted output
- [ ] **Multiple Activities:** Submit 5+ activities → All appear in output
- [ ] **Summary Generation:** Check output → Contains "06:00 PM – Summary of today"
- [ ] **No Modification:** Input "03:47 PM" → Output shows "03:47 PM" exactly
- [ ] **Missing Date:** Submit without date → Get 400 error
- [ ] **Empty Activities:** Submit empty array → Get 400 error
- [ ] **Partial Activity:** Submit time without description → Get 400 error
- [ ] **Special Characters:** Use "Testing & debugging" → Preserves "&"
- [ ] **Long Descriptions:** Use 100+ char description → Preserved fully

---

## Performance Expectations

| Metric | Expected Value |
|--------|----------------|
| Response Time | 2-8 seconds (depends on DeepSeek API) |
| Max Activities | No hard limit (tested up to 20+) |
| Report Length | ~500-2000 characters typically |
| Token Usage | ~300-800 tokens per request |

---

## Debugging Tips

### Enable Detailed Logging

In [route.ts](app/api/generate-report/route.ts), line 76, the error is logged:

```typescript
console.error('Report generation error:', error);
```

Check your terminal running `npm run dev` for detailed error messages.

### Verify Environment Variables

```bash
# Check if env vars are loaded
echo $DEEPSEEK_API_KEY  # Linux/Mac
echo %DEEPSEEK_API_KEY%  # Windows CMD
$env:DEEPSEEK_API_KEY   # Windows PowerShell
```

In Next.js, you can also check server-side:

```typescript
console.log('API Key present:', !!process.env.DEEPSEEK_API_KEY);
console.log('API URL:', process.env.DEEPSEEK_API_URL);
```

---

## Production Considerations

When deploying to production (Vercel, Netlify, etc.):

1. **Environment Variables:**
   - Set `DEEPSEEK_API_KEY` in platform settings
   - Set `DEEPSEEK_API_URL` if using custom endpoint

2. **Rate Limiting:**
   - Consider adding rate limiting to prevent abuse
   - Implement request throttling if needed

3. **Error Handling:**
   - Log errors to monitoring service (Sentry, LogRocket)
   - Don't expose sensitive error details to users

4. **CORS:**
   - Configure if frontend is on different domain
   - Add appropriate security headers

5. **Caching:**
   - Consider caching identical requests (optional)
   - Use Next.js `revalidate` for static generation

---

## Alternative Test Data

### Software Developer Report

```json
{
  "date": "April 3, 2026",
  "activities": [
    {"time": "08:45 AM", "description": "Code review for pull requests"},
    {"time": "10:00 AM", "description": "Implemented Redis caching layer"},
    {"time": "01:00 PM", "description": "Debugged production API timeout issue"},
    {"time": "03:30 PM", "description": "Tech talk on microservices architecture"},
    {"time": "05:00 PM", "description": "Deployed hotfix to staging environment"}
  ]
}
```

### Project Manager Report

```json
{
  "date": "April 3, 2026",
  "activities": [
    {"time": "09:00 AM", "description": "Daily standup with development team"},
    {"time": "10:30 AM", "description": "Sprint retrospective meeting"},
    {"time": "01:00 PM", "description": "Budget review with finance department"},
    {"time": "03:00 PM", "description": "Stakeholder presentation on Q2 roadmap"},
    {"time": "04:30 PM", "description": "Updated project timeline in Jira"}
  ]
}
```

### Marketing Specialist Report

```json
{
  "date": "April 3, 2026",
  "activities": [
    {"time": "09:15 AM", "description": "Analyzed campaign performance metrics"},
    {"time": "11:00 AM", "description": "Created social media content calendar"},
    {"time": "02:00 PM", "description": "Meeting with design team for ad creatives"},
    {"time": "04:00 PM", "description": "Finalized blog post on product launch"}
  ]
}
```

These examples help test different professional contexts and ensure the AI generates appropriate summaries for various roles.
