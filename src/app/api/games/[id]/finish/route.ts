// src/app/api/games/[id]/finish/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ahora necesitamos esperar la resolución de params
    const { id } = await params;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: "ID de juego inválido" },
        { status: 400 }
      );
    }

    // Obtener el juego con participantes y puntuaciones
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        gameParticipants: {
          include: {
            player: true,
            scores: true
          }
        }
      }
    });

    if (!game) {
      return NextResponse.json(
        { error: "Juego no encontrado" },
        { status: 404 }
      );
    }

    // Resto del código sin cambios...
    const playerScores = new Map();
    game.gameParticipants.forEach(participant => {
      const totalScore = participant.scores.reduce((sum, score) => sum + score.value, 0);
      playerScores.set(participant.playerId, {
        participantId: participant.id,
        totalScore
      });
    });

    let minScore = Infinity;
    let winningPlayerId: number | null = null;

    playerScores.forEach(({ totalScore }, playerId) => {
      if (totalScore < minScore) {
        minScore = totalScore;
        winningPlayerId = playerId;
      }
    });

    await prisma.$transaction(async (tx) => {
      await tx.game.update({
        where: { id: gameId },
        data: {
          isActive: false,
          completedAt: new Date(),
          winnerId: winningPlayerId
        }
      });

      for (const [playerId, { totalScore }] of playerScores.entries()) {
        const player = await tx.player.findUnique({
          where: { id: playerId }
        });

        if (player) {
          await tx.player.update({
            where: { id: playerId },
            data: {
              completedGames: player.completedGames + 1,
              totalPoints: player.totalPoints + totalScore,
              totalVictories: playerId === winningPlayerId 
                ? player.totalVictories + 1 
                : player.totalVictories
            }
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al finalizar juego:", error);
    return NextResponse.json(
      { error: "Error al finalizar el juego" },
      { status: 500 }
    );
  }
}