import { ImageResponse } from '@vercel/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Anotador de Carioca';
  const subtitle = searchParams.get('subtitle') || 'Registra tus puntuaciones fácilmente';
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#1a5336',
          padding: '40px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.6)',
            padding: '40px 60px',
            borderRadius: '20px',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '80px', fontWeight: 'bold', marginBottom: '24px' }}>
            {title}
          </span>
          <span style={{ fontSize: '40px', opacity: 0.9 }}>
            {subtitle}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}