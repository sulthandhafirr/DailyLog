# Vercel Deployment Guide

## Prerequisites
Make sure you have:
1. A Vercel account (sign up at https://vercel.com)
2. Supabase database setup
3. DeepSeek API key

## Environment Variables
Set the following environment variables in your Vercel project:

### Required Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `DEEPSEEK_API_KEY` - Your DeepSeek API key
- `DEEPSEEK_API_URL` - (Optional) DeepSeek API endpoint (default: https://api.deepseek.com/v1)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables in Settings → Environment Variables
5. Deploy!

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add DEEPSEEK_API_KEY

# Deploy to production
vercel --prod
```

## Build Configuration
The project is configured to use Webpack for production builds (not Turbopack) due to compatibility with PDF generation libraries.

Build command: `next build --webpack` (already configured in package.json)

## Troubleshooting

### Build Fails with "Call retries were exceeded"
- Check that all environment variables are set correctly
- Ensure your Supabase database is accessible
- Verify your DeepSeek API key is valid

### PDF Export Not Working
- Make sure `serverExternalPackages` in next.config.ts includes pdfkit dependencies
- Verify the build is using webpack (not turbopack)

### Database Connection Issues
- Double-check NEXT_PUBLIC_SUPABASE_URL format (should be https://xxx.supabase.co)
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is the anonymous/public key, not service key

## Post-Deployment
1. Test the deployed application
2. Generate a sample report
3. Test PDF/DOCX export functionality
4. Verify report history loads correctly

## Support
If you encounter issues, check:
- Vercel deployment logs
- Browser console for client-side errors
- Function logs for API route errors
