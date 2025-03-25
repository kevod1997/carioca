// src/app/partidas/[id]/page.tsx
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScoreTable } from "@/components/score-table";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { FinishGameButton } from "@/components/finish-game.button";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  // Esperar a que params se resuelva antes de acceder a sus propiedades
  const { id } = await params;
  const gameId = parseInt(id);

  if (isNaN(gameId)) {
    redirect("/");
  }

  // El resto del código permanece igual...
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      gameParticipants: {
        include: { player: true }
      },
      rounds: {
        orderBy: { roundNumber: "asc" },
      },
    },
  });

  if (!game) {
    redirect("/");
  }

  // Obtener todas las puntuaciones para este juego con la nueva estructura
  const scores = await prisma.score.findMany({
    where: {
      participant: {
        gameId: gameId,
      },
    },
    include: {
      participant: true,
      round: true
    }
  });

  // Preparar datos para el ScoreTable
  const players = game.gameParticipants.map(gp => ({
    id: gp.playerId,
    participantId: gp.id,
    name: gp.player.name
  }));

  // Adaptar puntuaciones al formato esperado por ScoreTable
  const adaptedScores = scores.map(score => ({
    playerId: score.participant.playerId,
    roundId: score.roundId,
    value: score.value
  }));

  // Determinar la siguiente ronda (si el juego no ha terminado)
  const nextRoundNumber = game.rounds.length < 7 ? game.rounds.length + 1 : null;

  // Comprobamos si el juego está activo para la lógica de finalización
  const isGameActive = game.isActive;

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {game.name || `Partida del ${new Date(game.createdAt).toLocaleDateString()}`}
          </h1>
          {!isGameActive && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">
              Partida finalizada el {game.completedAt ? new Date(game.completedAt).toLocaleDateString() : ""}
            </span>
          )}
        </div>
        <Link href="/">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>

      <ScoreTable
        players={players}
        rounds={game.rounds}
        scores={adaptedScores}
      />

      {nextRoundNumber ? (
        <div className="mt-6 text-center">
          <Link href={`/partidas/${gameId}/new-round?roundNumber=${nextRoundNumber}`}>
            <Button>
              Registrar Puntuaciones Mano {nextRoundNumber}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-800">
            ¡Juego Completado!
          </h2>
          <p className="mt-2">
            Todas las manos han sido jugadas. Revise las puntuaciones finales.
          </p>
          {isGameActive && <FinishGameButton gameId={gameId} />}
        </div>
      )}
    </main>
  );
}