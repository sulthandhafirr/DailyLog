import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid report ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data: report, error } = await supabase
      .from('daily_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !report) {
      return NextResponse.json(
        { 
          success: false, 
          error: error ? `Database error: ${error.message}` : 'Report not found'
        },
        { status: error ? 500 : 404 }
      );
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 72, right: 72 },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const lines = report.full_report.split('\n');

    lines.forEach((line: string, index: number) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        doc.moveDown(0.5);
        return;
      }

      if (trimmedLine.startsWith('Daily Report')) {
        doc
          .fontSize(12)
          .font('Times-Bold')
          .text(trimmedLine, { align: 'left' })
          .moveDown(1.5);
      }
      else if (trimmedLine.includes('Summary of today')) {
        const match = trimmedLine.match(/^(\d{2}:\d{2} [AP]M)\s*–\s*(.+)$/);
        if (match) {
          const time = match[1];
          const description = match[2];
          
          // Write time in bold, description regular
          doc
            .fontSize(12)
            .font('Times-Bold')
            .text(time + ' – ', { continued: true })
            .font('Times-Roman')
            .text(description);
          
          doc.moveDown(0.5);
        } else {
          doc
            .fontSize(12)
            .font('Times-Roman')
            .text(trimmedLine)
            .moveDown(0.5);
        }
      }
      else if (trimmedLine.startsWith('-')) {
        doc
          .fontSize(12)
          .font('Times-Roman')
          .text(trimmedLine, { indent: 20 })
          .moveDown(0.3);
      }
      else if (/^\d{2}:\d{2} [AP]M\s*–/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d{2}:\d{2} [AP]M)\s*–\s*(.+)$/);
        if (match) {
          const time = match[1];
          const description = match[2];
          
          doc
            .fontSize(12)
            .font('Times-Bold')
            .text(time + ' – ', { continued: true })
            .font('Times-Roman')
            .text(description);
          
          doc.moveDown(0.3);
        } else {
          doc
            .fontSize(12)
            .font('Times-Roman')
            .text(trimmedLine)
            .moveDown(0.3);
        }
      }
      else {
        doc
          .fontSize(12)
          .font('Times-Roman')
          .text(trimmedLine)
          .moveDown(0.3);
      }
    });

    doc.end();

    await new Promise<void>((resolve) => {
      doc.on('end', () => resolve());
    });

    const buffer = Buffer.concat(chunks);

    const match = report.report_date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    let formattedDate = report.report_date;
    
    if (match) {
      const day = match[3];
      const month = match[2];
      const year = match[1].slice(-2);
      formattedDate = `${day}_${month}_${year}`;
    }
    
    const filename = `Daily Report Rafief ${formattedDate}.pdf`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export to PDF',
      },
      { status: 500 }
    );
  }
}
