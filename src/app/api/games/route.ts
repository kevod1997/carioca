export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, players } = body;
    
    if (!players || !Array.isArray(players) || players.length < 3 || players.length > 5) {
      return NextResponse.json(
        { error: "Se requieren entre 3 y 5 jugadores" },
        { status: 400 }
      );
    }
    
    // Crear el juego y los participantes en una transacción
    const game = await prisma.$transaction(async (tx) => {
      // Crear el juego
      const newGame = await tx.game.create({
        data: {
          name: name || `Partida ${new Date().toISOString()}`,
          isActive: true,
        },
      });
      
      // Procesar jugadores (crear nuevos o usar existentes)
      for (const playerInfo of players) {
        if (playerInfo.name.trim() === "") continue;
        
        let playerId = playerInfo.id;
        
        // Si no tiene ID o no existe, crear nuevo jugador
        if (!playerId) {
          const existingPlayer = await tx.player.findUnique({
            where: { name: playerInfo.name.trim() }
          });
          
          if (existingPlayer) {
            playerId = existingPlayer.id;
          } else {
            const newPlayer = await tx.player.create({
              data: { name: playerInfo.name.trim() }
            });
            playerId = newPlayer.id;
          }
        }

        await tx.player.update({
          where: { id: playerId },
          data: {
            totalGames: {
              increment: 1
            }
          }
        });

        // Crear la participación en el juego
        await tx.gameParticipant.create({
          data: {
            gameId: newGame.id,
            playerId: playerId,
          }
        });
      }
      
      return newGame;
    });
    
    return NextResponse.json(game);
  } catch (error) {
    console.error("Error al crear juego:", error);
    return NextResponse.json(
      { error: "Error al crear el juego" },
      { status: 500 }
    );
  }
}