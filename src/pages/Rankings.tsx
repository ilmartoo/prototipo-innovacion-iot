import TopBar from "@/components/ui/TopBar";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import RankingTable from "@/components/ui/RankingTable";
import type { ActivityRanking } from "@/data/models/activity-ranking";

export default function Rankings() {
  const [search, setSearch] = useState<string>("");

  // --- TÍTULOS DE LAS SECCIONES ---
  const titleAmigos = "Amigos - Actividades este mes";
  const titleGlobal = "Global - Baloncesto - Puntos este año";

  // --- DATOS ---
  const rankingsAmigos: Record<string, ActivityRanking<string>> = {
    "1": { id: "1", userId: "U-0000", rank: 1, points: 26, payload: "" },
    "2": { id: "2", userId: "U-0001", rank: 2, points: 20, payload: "" },
    "3": { id: "3", userId: "U-0002", rank: 3, points: 17, payload: "" },
    "4": { id: "4", userId: "U-0003", rank: 4, points: 11, payload: "" },
    "5": { id: "5", userId: "U-0004", rank: 5, points: 4,  payload: "" },
  };

  const rankingsGlobal: Record<string, ActivityRanking<string>> = {
    "10": { id: "10", userId: "U-0009", rank: 1, points: 341, payload: "" },
    "11": { id: "11", userId: "U-0006", rank: 2, points: 298, payload: "" },
    "12": { id: "12", userId: "U-0007", rank: 3, points: 269, payload: "" },
    "13": { id: "13", userId: "U-0008", rank: 4, points: 247, payload: "" },
    "14": { id: "14", userId: "U-0005", rank: 5, points: 178, payload: "" },
  };

  const showAmigos = titleAmigos.toLowerCase().includes(search.toLowerCase());
  const showGlobal = titleGlobal.toLowerCase().includes(search.toLowerCase());
  
  const noResults = !showAmigos && !showGlobal;

  return (
    <div className="min-h-screen pb-20">
      <TopBar title="Rankings" to="/" />

      <div className="p-4 space-y-6">
        {/* Buscador */}
        <InputGroup className="bg-white shadow-sm rounded-lg mb-6">
          <InputGroupInput
            placeholder="Buscar ranking (ej: Global, Amigos...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none focus:ring-0"
          />
          <InputGroupAddon align="inline-end" className="pr-3 text-gray-400">
            <SearchIcon size={20} />
          </InputGroupAddon>
        </InputGroup>

        {/* TABLA 1: Amigos */}
        {showAmigos && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground px-1">
              {titleAmigos}
            </h3>

            <RankingTable
              rankings={rankingsAmigos}
              layout="simple"
              labels={{
                subject: "Amigo",
                value: "Número de actividades",
              }}
            />
          </div>
        )}

        {/* TABLA 2: Global */}
        {showGlobal && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground px-1">
              {titleGlobal}
            </h3>
          <RankingTable 
            rankings={rankingsGlobal}
            layout = "simple"
            labels={{ subject: "Deportista", value: "Puntos" }}
          />
          </div>
        )}

        {/* Mensaje de "No encontrado"*/}
        {noResults && (
            <div className="text-center text-gray-500 py-10">
                No se encontraron rankings con ese nombre.
            </div>
        )}

      </div>
    </div>
  );
}