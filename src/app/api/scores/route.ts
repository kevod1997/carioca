// src/app/api/scores/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gameId, roundNumber, scores } = body;
    
    if (!gameId || !roundNumber || !scores || typeof scores !== "object") {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    // Obtener todos los participantes de este juego para mapear playerId a participantId
    const participants = await prisma.gameParticipant.findMany({
      where: {
        gameId: gameId
      }
    });

    // Crear un mapeo de playerId a participantId
    const playerToParticipantMap = new Map();
    participants.forEach(participant => {
      playerToParticipantMap.set(participant.playerId, participant.id);
    });
    
    // Crear la ronda y las puntuaciones en una transacción
    await prisma.$transaction(async (tx) => {
      // Crear la ronda
      const round = await tx.round.create({
        data: {
          roundNumber,
          gameId,
        },
      });
      
      // Crear las puntuaciones
      for (const [playerIdStr, scoreValue] of Object.entries(scores)) {
        const playerId = parseInt(playerIdStr);
        const participantId = playerToParticipantMap.get(playerId);
        
        if (!participantId) {
          throw new Error(`No se encontró participación para el jugador ${playerId} en el juego ${gameId}`);
        }
        
        const value = typeof scoreValue === "string" ? parseInt(scoreValue) : scoreValue as number;
        
        await tx.score.create({
          data: {
            value,
            participantId, // Usar participantId en lugar de playerId
            roundId: round.id,
          },
        });
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al registrar puntuaciones:", error);
    return NextResponse.json(
      { error: "Error al registrar las puntuaciones" },
      { status: 500 }
    );
  }
}