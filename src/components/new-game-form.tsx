// src/components/new-game-form.tsx - versión actualizada
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";

type Player = {
  id: number;
  name: string;
};

export function NewGameForm() {
  const [gameName, setGameName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Array<{ id: number | null; name: string }>>([
    { id: null, name: "" }, 
    { id: null, name: "" }, 
    { id: null, name: "" }
  ]);
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cargar jugadores existentes
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/players");
        if (response.ok) {
          const data = await response.json();
          setExistingPlayers(data);
        }
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const addPlayer = () => {
    if (selectedPlayers.length < 5) {
      setSelectedPlayers([...selectedPlayers, { id: null, name: "" }]);
    }
  };

  const removePlayer = (index: number) => {
    if (selectedPlayers.length > 3) {
      const newPlayers = [...selectedPlayers];
      newPlayers.splice(index, 1);
      setSelectedPlayers(newPlayers);
    }
  };

  const updatePlayer = (index: number, id: number | null, name: string) => {
    const newPlayers = [...selectedPlayers];
    newPlayers[index] = { id, name };
    setSelectedPlayers(newPlayers);
  };

  const handleSelectExistingPlayer = (index: number, playerId: number) => {
    const player = existingPlayers.find(p => p.id === playerId);
    if (player) {
      updatePlayer(index, player.id, player.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar jugadores
    const validPlayers = selectedPlayers.filter(p => p.name.trim() !== "");
    
    if (validPlayers.length < 3) {
      alert("Se necesitan al menos 3 jugadores");
      return;
    }
    
    // Verificar que no hay nombres duplicados
    const playerNames = validPlayers.map(p => p.name.trim());
    if (new Set(playerNames).size !== playerNames.length) {
      alert("No puede haber nombres de jugadores duplicados");
      return;
    }

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName || `Partida ${new Date().toLocaleDateString()}`,
          players: validPlayers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/partidas/${data.id}`);
      } else {
        throw new Error("Error al crear el juego");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al crear el juego");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Nuevo Juego de Carioca</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameName">Nombre de la partida (opcional)</Label>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Partida de Carioca"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Jugadores (3-5)</Label>
            {selectedPlayers.map((player, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Combobox
                    options={existingPlayers.map(p => ({
                      label: p.name,
                      value: p.id.toString()
                    }))}
                    value={player.id?.toString() || ""}
                    onChange={(value) => handleSelectExistingPlayer(index, parseInt(value))}
                    onInputChange={(value) => updatePlayer(index, null, value)}
                    placeholder={`Buscar o crear jugador ${index + 1}`}
                    createOption={true}
                    inputValue={player.name}
                    disabled={isLoading}
                  />
                </div>
                {selectedPlayers.length > 3 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removePlayer(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            
            {selectedPlayers.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={addPlayer}
              >
                Añadir Jugador
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Comenzar Juego
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}