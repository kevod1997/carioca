export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Inicio',
  description: 'Crea nuevas partidas de Carioca y registra tus puntuaciones',
};

import { NewGameForm } from "@/components/new-game-form";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigateButton } from "@/components/ui/navigate-button";

export default async function Home() {
  const activeGames = await prisma.game.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      gameParticipants: {
        include: { player: true }
      }
    }
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Anotador de Carioca
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Iniciar Nuevo Juego</h2>
          <NewGameForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Juegos Activos</h2>
          {activeGames.length > 0 ? (
            <div className="space-y-2">
              {activeGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/partidas/${game.id}`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-between">
                    <span>
                      {game.name || `Partida del ${new Date(game.createdAt).toLocaleDateString()}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {game.gameParticipants.map(p => p.player.name).join(", ")}
                    </span>
                  </Button>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No hay juegos activos</p>
          )}

          <div className="mt-6">
            <NavigateButton href="/historial" variant="outline" className="w-full">
              Ver Historial de Partidas
            </NavigateButton>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <NavigateButton href="/jugadores" variant="outline" className="w-full">
          Ver Estadísticas de Jugadores
        </NavigateButton>
      </div>
    </main>
  );
}