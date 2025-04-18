"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type CurrentDealerProps = {
  players: {
    id: number;
    name: string;
    dealOrder?: number;
  }[];
  completedRounds: number;
  nextRoundNumber: number | null;
};

export function CurrentDealer({ players , nextRoundNumber }: CurrentDealerProps) {
  // Si no hay orden de repartida o no hay próxima ronda, no mostramos nada
  if (!players.some(p => p.dealOrder) || !nextRoundNumber) {
    return null;
  }

  // Ordenar jugadores por orden de repartida
  const sortedPlayers = [...players].sort((a, b) => 
    (a.dealOrder || 0) - (b.dealOrder || 0)
  );
  
  // La ronda actual es la próxima a jugarse (después de las completadas)
  const currentRoundNumber = nextRoundNumber;
  
  // Determinar repartidor actual
  const currentDealerIndex = (currentRoundNumber - 1) % sortedPlayers.length;
  const currentDealer = sortedPlayers[currentDealerIndex];
  
  // Calcular la próxima ronda después de la actual
  const upcomingRoundNumber = currentRoundNumber < 7 ? currentRoundNumber + 1 : null;
  
  // Calcular número de cartas para la ronda actual
  const currentCardsCount = 6 + currentRoundNumber; // Se inicia con 7 cartas en la ronda 1
  
  // Calcular número de cartas para la próxima ronda
  const upcomingCardsCount = upcomingRoundNumber ? 6 + upcomingRoundNumber : null;
  
  let nextDealer = null;
  if (upcomingRoundNumber) {
    const nextDealerIndex = (upcomingRoundNumber - 1) % sortedPlayers.length;
    nextDealer = sortedPlayers[nextDealerIndex];
  }

  return (
    <Card className="p-3 mb-4 bg-blue-50 border-blue-200">
      <div className="grid md:grid-cols-2 gap-y-2 gap-x-4">
        <div className="flex flex-col">
          <div className="text-center md:text-left font-medium mb-1">
            Ronda actual ({currentRoundNumber}):
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Reparte: {currentDealer.name}
            </Badge>
            <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
              {currentCardsCount} cartas
            </Badge>
          </div>
        </div>

        {nextDealer && upcomingRoundNumber && upcomingCardsCount && (
          <div className="flex flex-col">
            <div className="text-center md:text-left font-medium mb-1">
              Próxima ronda ({upcomingRoundNumber}):
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Repartirá: {nextDealer.name}
              </Badge>
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                {upcomingCardsCount} cartas
              </Badge>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}