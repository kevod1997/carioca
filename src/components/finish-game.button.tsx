// src/components/finish-game.button.tsx (actualizado)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type FinishGameButtonProps = {
  gameId: number;
};

export function FinishGameButton({ gameId }: FinishGameButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinishGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/finish`, {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        console.error("Error al finalizar el juego");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button className="mt-4" onClick={handleFinishGame} isLoading={isLoading}>
      Finalizar Partida
    </Button>
  );
}