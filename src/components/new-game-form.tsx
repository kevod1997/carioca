// "use client"; 

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Combobox } from "@/components/ui/combobox";

// type Player = {
//   id: number;
//   name: string;
// };

// export function NewGameForm() {
//   const [gameName, setGameName] = useState("");
//   const [selectedPlayers, setSelectedPlayers] = useState<Array<{ id: number | null; name: string }>>([
//     { id: null, name: "" }, 
//     { id: null, name: "" }, 
//     { id: null, name: "" }
//   ]);
//   const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   // Cargar jugadores existentes
//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const response = await fetch("/api/players");
//         if (response.ok) {
//           const data = await response.json();
//           setExistingPlayers(data);
//         }
//       } catch (error) {
//         console.error("Error al cargar jugadores:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPlayers();
//   }, []);

//   const addPlayer = () => {
//     if (selectedPlayers.length < 5) {
//       setSelectedPlayers([...selectedPlayers, { id: null, name: "" }]);
//     }
//   };

//   const removePlayer = (index: number) => {
//     if (selectedPlayers.length > 3) {
//       const newPlayers = [...selectedPlayers];
//       newPlayers.splice(index, 1);
//       setSelectedPlayers(newPlayers);
//     }
//   };

//   const updatePlayer = (index: number, id: number | null, name: string) => {
//     const newPlayers = [...selectedPlayers];
//     newPlayers[index] = { id, name };
//     setSelectedPlayers(newPlayers);
//   };

//   const handleSelectExistingPlayer = (index: number, playerId: number) => {
//     const player = existingPlayers.find(p => p.id === playerId);
//     if (player) {
//       updatePlayer(index, player.id, player.name);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Validar jugadores
//     const validPlayers = selectedPlayers.filter(p => p.name.trim() !== "");
    
//     if (validPlayers.length < 3) {
//       alert("Se necesitan al menos 3 jugadores");
//       setIsSubmitting(false);
//       return;
//     }
    
//     // Verificar que no hay nombres duplicados
//     const playerNames = validPlayers.map(p => p.name.trim());
//     if (new Set(playerNames).size !== playerNames.length) {
//       alert("No puede haber nombres de jugadores duplicados");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/games", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: gameName || `Partida ${new Date().toLocaleDateString()}`,
//           players: validPlayers,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         router.push(`/partidas/${data.id}`);
//       } else {
//         throw new Error("Error al crear el juego");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Ocurrió un error al crear el juego");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Nuevo Juego de Carioca</CardTitle>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="gameName">Nombre de la partida (opcional)</Label>
//             <Input
//               id="gameName"
//               value={gameName}
//               onChange={(e) => setGameName(e.target.value)}
//               placeholder="Partida de Carioca"
//               disabled={isSubmitting}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label>Jugadores (3-5)</Label>
//             {selectedPlayers.map((player, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <div className="flex-1">
//                   <Combobox
//                     options={existingPlayers.map(p => ({
//                       label: p.name,
//                       value: p.id.toString()
//                     }))}
//                     value={player.id?.toString() || ""}
//                     onChange={(value) => handleSelectExistingPlayer(index, parseInt(value))}
//                     onInputChange={(value) => updatePlayer(index, null, value)}
//                     placeholder={`Buscar o crear jugador ${index + 1}`}
//                     createOption={true}
//                     inputValue={player.name}
//                     disabled={isLoading || isSubmitting}
//                   />
//                 </div>
//                 {selectedPlayers.length > 3 && (
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     size="icon" 
//                     onClick={() => removePlayer(index)}
//                     disabled={isSubmitting}
//                   >
//                     ✕
//                   </Button>
//                 )}
//               </div>
//             ))}
            
//             {selectedPlayers.length < 5 && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full mt-2"
//                 onClick={addPlayer}
//                 disabled={isSubmitting}
//               >
//                 Añadir Jugador
//               </Button>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button type="submit" className="w-full" isLoading={isSubmitting}>
//            {
//               isSubmitting ? "Creando la partida..." : "Empezar Juego"
//            }
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }

// src/components/new-game-form.tsx
"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Función para reordenar la lista cuando se arrastra un jugador
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedPlayers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSelectedPlayers(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar jugadores
    const validPlayers = selectedPlayers.filter(p => p.name.trim() !== "");
    
    if (validPlayers.length < 3) {
      alert("Se necesitan al menos 3 jugadores");
      setIsSubmitting(false);
      return;
    }
    
    // Verificar que no hay nombres duplicados
    const playerNames = validPlayers.map(p => p.name.trim());
    if (new Set(playerNames).size !== playerNames.length) {
      alert("No puede haber nombres de jugadores duplicados");
      setIsSubmitting(false);
      return;
    }

    // Añadir el orden de repartida a cada jugador
    const playersWithDealOrder = validPlayers.map((player, index) => ({
      ...player,
      dealOrder: index + 1,
    }));

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: gameName || `Partida ${new Date().toLocaleDateString()}`,
          players: playersWithDealOrder,
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
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Jugadores (3-5) - Arrastra para establecer el orden de repartida</Label>
            <p className="text-sm text-muted-foreground mb-2">
              El primer jugador de la lista repartirá primero, y así sucesivamente.
            </p>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="players">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {selectedPlayers.map((player, index) => (
                      <Draggable key={index} draggableId={`player-${index}`} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-2 bg-card border rounded-md p-1"
                          >
                            <div 
                              className="px-2 py-1 bg-secondary rounded text-secondary-foreground cursor-move"
                              {...provided.dragHandleProps}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <Combobox
                                options={existingPlayers.map(p => ({
                                  label: p.name,
                                  value: p.id.toString()
                                }))}
                                value={player.id?.toString() || ""}
                                onChange={(value) => handleSelectExistingPlayer(index, parseInt(value))}
                                onInputChange={(value) => updatePlayer(index, null, value)}
                                placeholder={`Jugador ${index + 1}`}
                                createOption={true}
                                inputValue={player.name}
                                disabled={isLoading || isSubmitting}
                              />
                            </div>
                            {selectedPlayers.length > 3 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon" 
                                onClick={() => removePlayer(index)}
                                disabled={isSubmitting}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {selectedPlayers.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={addPlayer}
                disabled={isSubmitting}
              >
                Añadir Jugador
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
           {
              isSubmitting ? "Creando la partida..." : "Empezar Juego"
           }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}