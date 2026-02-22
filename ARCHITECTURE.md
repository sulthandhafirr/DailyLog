# AI Prompting Architecture

## Overview

This document explains the exact prompts sent to DeepSeek AI and how the system ensures accurate, hallucination-free report generation.

---

## System Prompt (Always Included)

**Location:** `lib/prompts.ts → SYSTEM_PROMPT`

```
You are an AI assistant that generates professional daily work reports.

Rules:
- Never modify user-provided times or descriptions.
- Never infer or add new activities.
- The summary must always be written at exactly 06:00 PM.
- Only summarize meaningful work-related activities.
- Ignore breaks unless explicitly important.
- Use professional workplace language.
- Output must be clean and suitable for Word or PDF export.
```

**Purpose:** This prompt is sent with EVERY request to define the AI's behavior and constraints. It ensures the AI never hallucinates or modifies user data.

---

## User Prompt Template

**Location:** `lib/prompts.ts → buildUserPrompt()`

**Template Structure:**

```
Generate a professional daily work report for [DATE].

Input activities:
[TIME] – [DESCRIPTION]
[TIME] – [DESCRIPTION]
...

Output format (STRICT):
Daily Report – [DATE]

[List all activities exactly as provided, preserving times and descriptions]

06:00 PM – Summary of today
- [Bullet point summarizing key accomplishments]
- [Bullet point summarizing key accomplishments]
- [Additional bullet points as needed]

Remember:
1. Do not modify any times or descriptions
2. Add the summary at exactly 06:00 PM
3. Make the summary professional and concise
4. Only reference activities that were actually performed
```

**Example with Real Data:**

If the user inputs:
- Date: "February 15, 2026"
- Activities:
  - 09:00 AM – Team standup meeting
  - 11:00 AM – Code review for authentication module
  - 02:30 PM – Meeting with client about project requirements

The exact prompt sent to AI would be:

```
Generate a professional daily work report for February 15, 2026.

Input activities:
09:00 AM – Team standup meeting
11:00 AM – Code review for authentication module
02:30 PM – Meeting with client about project requirements

Output format (STRICT):
Daily Report – February 15, 2026

[List all activities exactly as provided, preserving times and descriptions]

06:00 PM – Summary of today
- [Bullet point summarizing key accomplishments]
- [Bullet point summarizing key accomplishments]
- [Additional bullet points as needed]

Remember:
1. Do not modify any times or descriptions
2. Add the summary at exactly 06:00 PM
3. Make the summary professional and concise
4. Only reference activities that were actually performed
```

---

## Expected AI Output

Based on the above example, the AI should generate:

```
Daily Report – February 15, 2026

09:00 AM – Team standup meeting
11:00 AM – Code review for authentication module
02:30 PM – Meeting with client about project requirements

06:00 PM – Summary of today
- Participated in daily team standup to align on sprint progress
- Conducted thorough code review for the authentication module implementation
- Met with client to discuss and clarify project requirements for next phase
```

**Key Characteristics:**
- ✅ All user-provided activities are listed exactly as entered
- ✅ Times are NOT modified
- ✅ Descriptions are NOT changed
- ✅ Summary appears at exactly 06:00 PM
- ✅ Summary only references provided activities
- ✅ Professional, clear language

---

## API Configuration

**Location:** `app/api/generate-report/route.ts`

**DeepSeek API Call Parameters:**

```typescript
const completion = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ],
  temperature: 0.3,  // Low for consistency
  max_tokens: 2000,  // Sufficient for reports
});
```

**Why temperature = 0.3?**
- Lower temperature = more deterministic output
- Reduces creativity and randomness
- Ensures consistent adherence to formatting rules
- Minimizes hallucination risk

---

## Validation & Safety Measures

### Backend Validation (API Route)

1. **Input Validation:**
   - Checks if date is provided
   - Ensures at least one activity exists
   - Validates each activity has both time and description

2. **Error Handling:**
   - API key presence check
   - Network error handling
   - Empty response detection

### Frontend Validation (ReportForm)

1. **Empty Field Prevention:**
   - Filters out activities with missing time or description
   - Alerts user if date is missing
   - Prevents submission with zero valid activities

2. **User Experience:**
   - Disable form during generation
   - Show loading state
   - Display errors clearly

---

## Anti-Hallucination Measures

The system implements multiple layers to prevent AI hallucination:

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **System Prompt** | Explicit rules against modification | Sets behavioral boundaries |
| **User Prompt** | "Exactly as provided" instruction | Reinforces preservation requirement |
| **Temperature** | Set to 0.3 (low) | Reduces creative liberty |
| **Output Format** | Strict template in prompt | Guides structure adherence |
| **Reminder Section** | Numbered rules at prompt end | Final reinforcement of constraints |

---

## Data Flow

```
User Input (Form)
    ↓
Frontend Validation
    ↓
POST /api/generate-report
    ↓
Backend Validation
    ↓
Build User Prompt (inject activities)
    ↓
Combine System Prompt + User Prompt
    ↓
DeepSeek API Call
    ↓
Extract Response
    ↓
Return to Frontend
    ↓
Display + Export Options
```

---

## Customization Guide

### To Change Summary Time

Edit `lib/prompts.ts`:

```typescript
// Change "06:00 PM" to your preferred time
- The summary must always be written at exactly 06:00 PM.
+ The summary must always be written at exactly 05:00 PM.
```

### To Modify Output Format

Edit the "Output format (STRICT)" section in `buildUserPrompt()`:

```typescript
Output format (STRICT):
Daily Report – ${date}

[Your custom format here]
```

### To Adjust AI Creativity

Edit `app/api/generate-report/route.ts`:

```typescript
temperature: 0.3,  // Increase for more creative summaries (max 1.0)
```

**Recommendation:** Keep between 0.2-0.4 for professional reports.

---

## Testing Checklist

### Verify No Hallucination

- [ ] Input 3 activities → AI outputs exactly 3 activities
- [ ] Use unusual times (e.g., "03:47 PM") → AI preserves exact time
- [ ] Use technical jargon → AI doesn't simplify or change wording
- [ ] Include breaks/lunch → AI includes them if provided

### Verify Format Consistency

- [ ] Summary always at 06:00 PM
- [ ] Date in header matches input
- [ ] Bullet points used in summary
- [ ] No extra activities added

### Verify Error Handling

- [ ] Empty activities → Show validation error
- [ ] Missing API key → Return 500 with clear message
- [ ] Network failure → Show user-friendly error

---

## Conclusion

This architecture is designed to be **stateless**, **predictable**, and **hallucination-resistant**. The strict prompting strategy ensures the AI acts as a formatter/summarizer rather than a content generator, maintaining the integrity of user-provided data.
