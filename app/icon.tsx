import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          backgroundColor: '#2563eb',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Document lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ width: 16, height: 2, backgroundColor: 'white', borderRadius: 1 }} />
          <div style={{ width: 12, height: 2, backgroundColor: 'white', borderRadius: 1 }} />
          <div style={{ width: 16, height: 2, backgroundColor: 'white', borderRadius: 1 }} />
          <div style={{ width: 10, height: 2, backgroundColor: 'white', borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
