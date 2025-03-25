"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavigateButton } from "@/components/ui/navigate-button";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type GameActionsProps = {
  gameId: number;
  nextRoundNumber: number | null;
  isGameActive: boolean;
};

export function GameActions({ gameId, nextRoundNumber, isGameActive }: GameActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"cancel" | "finish" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleAction = async () => {
    if (!actionType) return;
    
    setIsLoading(true);
    try {
      const endpoint = actionType === "cancel" 
        ? `/api/games/${gameId}/cancel` 
        : `/api/games/${gameId}/finish`;
      
      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (response.ok) {
        // Mantener estado de carga visible para dar feedback
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      } else {
        const data = await response.json();
        alert(data.error || `Error al ${actionType === "cancel" ? "cancelar" : "finalizar"} la partida`);
        setIsLoading(false);
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Ocurrió un error al ${actionType === "cancel" ? "cancelar" : "finalizar"} la partida`);
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const openDialog = (type: "cancel" | "finish") => {
    setActionType(type);
    setShowConfirmDialog(true);
  };

  // Si estamos en estado de carga, mostrar indicador global
  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
        <LoadingSpinner className="mb-2" />
        <p className="text-sm text-gray-600">
          {actionType === "cancel" ? "Cancelando partida..." : "Finalizando partida..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {nextRoundNumber ? (
        <div className="mt-6 text-center">
          <NavigateButton href={`/partidas/${gameId}/new-round?roundNumber=${nextRoundNumber}`}>
            Registrar Puntuaciones Mano {nextRoundNumber}
          </NavigateButton>

          <div className="mt-4">
            <Button 
              variant="outline" 
              className="text-destructive border-destructive hover:bg-destructive/10" 
              onClick={() => openDialog("cancel")}
            >
              Cancelar Partida
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-green-800">
            ¡Juego Completado!
          </h2>
          <p className="mt-2">
            Todas las manos han sido jugadas. Revise las puntuaciones finales.
          </p>
          {isGameActive && (
            <div className="flex gap-4 justify-center mt-4">
              <Button onClick={() => openDialog("finish")}>
                Finalizar Partida
              </Button>
              <Button 
                variant="outline" 
                className="text-destructive border-destructive hover:bg-destructive/10" 
                onClick={() => openDialog("cancel")}
              >
                Cancelar Partida
              </Button>
            </div>
          )}
        </div>
      )}

      <AlertDialog 
        open={showConfirmDialog} 
        onOpenChange={(open) => {
          if (isLoading) return;
          setShowConfirmDialog(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "cancel" 
                ? "¿Cancelar esta partida?" 
                : "¿Finalizar esta partida?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "cancel" 
                ? "Esta acción eliminará permanentemente la partida y todas sus puntuaciones. Los contadores de partidas de los jugadores serán ajustados." 
                : "Esta acción marcará la partida como completada y actualizará las estadísticas de los jugadores."}
              {" "}Esta acción no puede deshacerse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === "cancel" 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                : ""}
              disabled={isLoading}
            >
              {actionType === "cancel" 
                ? "Sí, cancelar partida" 
                : "Sí, finalizar partida"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}