import { NextRequest, NextResponse } from 'next/server';
import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';
import { getSupabaseClient } from '@/lib/supabase';

/**
 * API Route: GET /api/export/docx/[id]
 * Exports a daily report as a Word (.docx) document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Defensive validation
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid report ID is required' },
        { status: 400 }
      );
    }

    console.log('[DOCX Export] Fetching report with ID:', id);

    // Fetch report from database
    const supabase = getSupabaseClient();
    const { data: report, error } = await supabase
      .from('daily_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !report) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error ? `Database error: ${error.message}` : 'Report not found'
        },
        { status: error ? 500 : 404 }
      );
    }

    // Split report into lines
    const lines = report.full_report.split('\n').filter((line: string) => line.trim());

    // Create Word document
    const paragraphs: Paragraph[] = [];

    lines.forEach((line: string, index: number) => {
      const trimmedLine = line.trim();

      // Title line (Daily Report – Date)
      if (trimmedLine.startsWith('Daily Report')) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 400 },
          })
        );
      }
      // Summary header
      else if (trimmedLine.includes('Summary of today')) {
        // Split time and "Summary of today"
        const match = trimmedLine.match(/^(\d{2}:\d{2} [AP]M)\s*–\s*(.+)$/);
        if (match) {
          const time = match[1];
          const description = match[2];
          
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: time + ' – ',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
                new TextRun({
                  text: description,
                  bold: false,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { before: 200, after: 200 },
            })
          );
        } else {
          // Fallback
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: false,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { before: 200, after: 200 },
            })
          );
        }
      }
      // Bullet points in summary
      else if (trimmedLine.startsWith('-')) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 100 },
            indent: { left: 720 },
          })
        );
      }
      // Activity lines with time (format: "HH:MM AM/PM – Description")
      else if (/^\d{2}:\d{2} [AP]M\s*–/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d{2}:\d{2} [AP]M)\s*–\s*(.+)$/);
        if (match) {
          const time = match[1];
          const description = match[2];
          
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: time + ' – ',
                  bold: true,
                  size: 24,
                  font: 'Times New Roman',
                }),
                new TextRun({
                  text: description,
                  bold: false,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 100 },
            })
          );
        } else {
          // Fallback
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  size: 24,
                  font: 'Times New Roman',
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      }
      // Regular lines
      else {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    console.log('[DOCX Export] Document generated successfully for:', report.report_date);

    // Format filename: "Daily Report Rafief dd_mm_yy"
    const match = report.report_date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    let formattedDate = report.report_date;
    
    if (match) {
      const day = match[3];
      const month = match[2];
      const year = match[1].slice(-2); // Get last 2 digits of year
      formattedDate = `${day}_${month}_${year}`;
    }
    
    const filename = `Daily Report Rafief ${formattedDate}.docx`;

    // Return as download
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export to DOCX',
      },
      { status: 500 }
    );
  }
}
