import { MetadataRoute } from 'next';
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener todas las partidas (o al menos las últimas)
  const games = await prisma.game.findMany({
    take: 100, // Limitar a 100 partidas para evitar problemas con sitemaps muy grandes
    orderBy: { createdAt: 'desc' },
  });

  // URLs estáticas
  const staticUrls = [
    {
      url: 'https://carioca.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://carioca.vercel.app/historial',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: 'https://carioca.vercel.app/jugadores',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // URLs dinámicas de partidas individuales
  const gameUrls = games.map((game) => ({
    url: `https://carioca.vercel.app/partidas/${game.id}`,
    lastModified: new Date(game.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticUrls, ...gameUrls];
}