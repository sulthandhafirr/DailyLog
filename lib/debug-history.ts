/**
 * Debug utility for troubleshooting History feature
 * Open browser console and run: testHistoryFeature()
 */

declare global {
  interface Window {
    testHistoryFeature: () => Promise<void>;
    testReportById: (id: string) => Promise<void>;
  }
}

/**
 * Comprehensive test of all History endpoints
 */
async function testHistoryFeature() {
  console.log('🧪 Testing History Feature...\n');

  // Test 1: List all reports
  console.log('📋 Test 1: Fetch all reports');
  try {
    const res = await fetch('/api/reports');
    const data = await res.json();
    
    if (data.success) {
      console.log('✅ SUCCESS:', data.reports.length, 'reports found');
      console.table(data.reports.map((r: any) => ({
        id: r.id?.substring(0, 8) + '...',
        date: r.report_date,
        hasId: !!r.id
      })));
      
      // Store first report ID for further tests
      if (data.reports.length > 0) {
        (window as any).__testReportId = data.reports[0].id;
        console.log('📝 Stored test report ID:', (window as any).__testReportId);
      }
    } else {
      console.error('❌ FAILED:', data.error);
    }
  } catch (err) {
    console.error('❌ ERROR:', err);
  }

  console.log('\n---\n');

  // Test 2: Get single report (only if we have a test ID)
  if ((window as any).__testReportId) {
    console.log('📄 Test 2: Fetch single report');
    const testId = (window as any).__testReportId;
    
    try {
      const res = await fetch(`/api/reports/${testId}`);
      const data = await res.json();
      
      if (data.success) {
        console.log('✅ SUCCESS: Report fetched');
        console.log('- ID:', data.report.id);
        console.log('- Date:', data.report.report_date);
        console.log('- Activities:', data.report.activities?.length || 0);
        console.log('- Full report length:', data.report.full_report?.length || 0, 'chars');
      } else {
        console.error('❌ FAILED:', data.error);
      }
    } catch (err) {
      console.error('❌ ERROR:', err);
    }

    console.log('\n---\n');

    // Test 3: Test export endpoints (don't actually download)
    console.log('📦 Test 3: Check export endpoints');
    
    // Check DOCX endpoint
    try {
      const res = await fetch(`/api/export/docx/${testId}`, { method: 'HEAD' });
      if (res.ok) {
        console.log('✅ DOCX export: Endpoint is accessible');
      } else {
        console.warn('⚠️ DOCX export: HTTP', res.status);
      }
    } catch (err) {
      console.error('❌ DOCX export ERROR:', err);
    }

    // Check PDF endpoint
    try {
      const res = await fetch(`/api/export/pdf/${testId}`, { method: 'HEAD' });
      if (res.ok) {
        console.log('✅ PDF export: Endpoint is accessible');
      } else {
        console.warn('⚠️ PDF export: HTTP', res.status);
      }
    } catch (err) {
      console.error('❌ PDF export ERROR:', err);
    }
  } else {
    console.warn('⚠️ Tests 2-3 skipped: No reports in database');
  }

  console.log('\n---\n');

  // Test 4: Validate data structure
  console.log('🔍 Test 4: Validate TypeScript types');
  try {
    const res = await fetch('/api/reports');
    const data = await res.json();
    
    if (data.success && data.reports.length > 0) {
      const report = data.reports[0];
      const requiredFields = ['id', 'report_date', 'activities', 'full_report', 'created_at'];
      const missingFields = requiredFields.filter(field => !(field in report));
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present');
      } else {
        console.error('❌ Missing fields:', missingFields);
      }

      // Check field types
      console.log('Field types:');
      console.log('- id:', typeof report.id, report.id ? '✅' : '❌');
      console.log('- report_date:', typeof report.report_date, '✅');
      console.log('- activities:', Array.isArray(report.activities) ? 'array ✅' : '❌');
      console.log('- full_report:', typeof report.full_report, '✅');
      console.log('- created_at:', typeof report.created_at, '✅');
    }
  } catch (err) {
    console.error('❌ ERROR:', err);
  }

  console.log('\n---\n');
  console.log('🏁 Test complete!\n');
}

/**
 * Test specific report by ID
 */
async function testReportById(id: string) {
  console.log('🧪 Testing report:', id, '\n');

  // Test GET
  console.log('📄 GET /api/reports/' + id);
  try {
    const res = await fetch(`/api/reports/${id}`);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('ERROR:', err);
  }

  console.log('\n---\n');

  // Test DOCX export URL
  console.log('📦 DOCX Export URL:');
  console.log(`/api/export/docx/${id}`);
  console.log('You can click this link to test download');

  console.log('\n---\n');

  // Test PDF export URL
  console.log('📦 PDF Export URL:');
  console.log(`/api/export/pdf/${id}`);
  console.log('You can click this link to test download');
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.testHistoryFeature = testHistoryFeature;
  window.testReportById = testReportById;
  
  console.log('📝 Debug utilities loaded!');
  console.log('Run these in console:');
  console.log('- testHistoryFeature()  → Test all endpoints');
  console.log('- testReportById(id)    → Test specific report');
}

export { testHistoryFeature, testReportById };
