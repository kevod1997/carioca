// src/app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';
import Image from 'next/image';
 
export const runtime = 'edge';

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Anotador de Carioca';
  const subtitle = searchParams.get('subtitle') || 'Registra tus puntuaciones fácilmente';
  const status = searchParams.get('status') || 'active';
  const winner = searchParams.get('winner') || '';
  
  // Obtener la URL base para referencias a imágenes
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  // Colores personalizados
  const colors = {
    background: '#1a5336', // Verde de fondo
    card: 'rgba(0, 0, 0, 0.7)',
    text: 'white',
    accent: '#ffd700', // Dorado
    statusActive: '#4ade80', // Verde para activo
    statusCompleted: '#6366f1', // Púrpura para completado
  };

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
          background: colors.background,
          padding: '60px',
        }}
      >
        {/* Decoración de fondo */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          borderRadius: '0 0 0 300px',
          background: 'rgba(255, 255, 255, 0.1)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200px',
          height: '200px',
          borderRadius: '0 200px 0 0',
          background: 'rgba(255, 255, 255, 0.1)',
        }} />
        
        {/* Logo con imagen desde carpeta public */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Image 
            src={`${baseUrl}/apple-touch-icon.png`}
            alt="Apple touch icon"
            width="50" 
            height="50"
            style={{
              marginRight: '16px',
              borderRadius: '8px',
            }}
          />
          Carioca Scorekeeper
        </div>
        
        {/* Status badge */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '20px',
          fontWeight: 'bold',
          background: status === 'active' ? colors.statusActive : colors.statusCompleted,
          color: colors.text,
        }}>
          {status === 'active' ? 'PARTIDA EN CURSO' : 'PARTIDA FINALIZADA'}
        </div>

        {/* Contenido principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: colors.card,
            padding: '50px 60px',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '1000px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Logo grande */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <Image 
              src={`${baseUrl}/favicon-32x32.png`}
              alt="Favicon"
              width="100" 
              height="100"
              style={{
                borderRadius: '12px',
              }}
            />
          </div>
          
          <div style={{ 
            fontSize: '72px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: colors.text,
            textAlign: 'center',
          }}>
            {truncateText(title, 30)}
          </div>
          
          <div style={{ 
            fontSize: '36px', 
            opacity: 0.9,
            color: colors.text,
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            {truncateText(subtitle, 50)}
          </div>
          
          {winner && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '20px 0',
            }}>
              <div style={{
                fontSize: '32px',
                color: colors.accent,
                marginBottom: '10px',
              }}>
                🏆 GANADOR 🏆
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: colors.accent,
              }}>
                {winner}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer con iconos de naipes */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.7)',
        }}>
          <span style={{ marginRight: '8px' }}>♠️</span>
          <span style={{ marginRight: '8px' }}>♥️</span>
          <span style={{ marginRight: '8px' }}>♦️</span>
          <span style={{ marginRight: '8px' }}>♣️</span>
          <span>carioca.vercel.app</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}