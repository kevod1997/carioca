// src/app/api/games/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);

    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: "ID de juego inválido" },
        { status: 400 }
      );
    }

    // Verificar que el juego existe y está activo
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!game) {
      return NextResponse.json(
        { error: "Juego no encontrado" },
        { status: 404 }
      );
    }

    if (!game.isActive) {
      return NextResponse.json(
        { error: "Solo se pueden cancelar partidas activas" },
        { status: 400 }
      );
    }

    // Actualizar el juego
    await prisma.$transaction(async (tx) => {
      // Obtener participantes
      const participants = await tx.gameParticipant.findMany({
        where: { gameId }
      });
      
      // Actualizar contador de partidas para cada jugador
      for (const participant of participants) {
        await tx.player.update({
          where: { id: participant.playerId },
          data: {
            totalGames: {
              decrement: 1
            }
          }
        });
      }
      
      // Eliminar todos los datos relacionados
      await tx.score.deleteMany({
        where: {
          participant: {
            gameId
          }
        }
      });
      
      await tx.round.deleteMany({
        where: { gameId }
      });
      
      await tx.gameParticipant.deleteMany({
        where: { gameId }
      });
      
      // Finalmente eliminar el juego
      await tx.game.delete({
        where: { id: gameId }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al cancelar juego:", error);
    return NextResponse.json(
      { error: "Error al cancelar el juego" },
      { status: 500 }
    );
  }
}