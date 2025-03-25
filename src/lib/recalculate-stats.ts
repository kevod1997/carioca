// src/lib/recalculate-stats.ts
import { prisma } from "@/lib/db";

export async function recalculateAllPlayerStats() {
  const players = await prisma.player.findMany();
  
  for (const player of players) {
    // Obtener todas las participaciones en juegos completados
    const participations = await prisma.gameParticipant.findMany({
      where: {
        playerId: player.id,
        game: {
          isActive: false
        }
      },
      include: {
        game: true,
        scores: true
      }
    });
    
    // Calcular estadísticas
    const completedGames = participations.length;
    const totalGames = await prisma.gameParticipant.count({
      where: { playerId: player.id }
    });
    
    // Contar victorias
    const victories = await prisma.game.count({
      where: {
        winnerId: player.id
      }
    });
    
    // Calcular puntos totales
    let totalPoints = 0;
    for (const participation of participations) {
      const participationPoints = participation.scores.reduce(
        (sum, score) => sum + score.value, 0
      );
      totalPoints += participationPoints;
    }
    
    // Actualizar el jugador
    await prisma.player.update({
      where: { id: player.id },
      data: {
        totalGames,
        completedGames,
        totalVictories: victories,
        totalPoints
      }
    });
  }
  
  return { success: true };
}