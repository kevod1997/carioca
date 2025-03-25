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
          fontSize: 60,
          color: 'white',
          background: '#1a5336', // Verde mesa de poker
          width: '100%',
          height: '100%',
          padding: '40px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Elementos decorativos de cartas */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '100px',
          height: '140px',
          background: 'white',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '40px',
          color: 'red',
          transform: 'rotate(-15deg)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        }}>
          ♥
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          width: '100px',
          height: '140px',
          background: 'white',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '40px',
          color: 'black',
          transform: 'rotate(10deg)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        }}>
          ♠
        </div>
        
        {/* Contenido principal */}
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '40px 60px',
          borderRadius: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontSize: 80, marginBottom: 24, fontWeight: 'bold' }}>
            {title}
          </div>
          <div style={{ fontSize: 40, opacity: 0.9 }}>
            {subtitle}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}