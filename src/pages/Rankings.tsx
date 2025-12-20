import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import RankingTable from "@/components/ui/RankingTable";
import TopBar from "@/components/ui/TopBar";
import { calculateRanking, type ActivityRankingPending } from "@/data/models/activity-ranking";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function Rankings() {
  const [search, setSearch] = useState<string>("");

  // --- TÍTULOS DE LAS SECCIONES ---
  const titleAmigos = "Amigos - Actividades este mes";
  const titleGlobal = "Global - Baloncesto - Puntos este año";

  // --- DATOS ---
  const rankingsAmigos: ActivityRankingPending[] = [
    { userId: "U-0000", points: 26, payload: null },
    { userId: "U-0001", points: 20, payload: null },
    { userId: "U-0002", points: 17, payload: null },
    { userId: "U-0003", points: 11, payload: null },
    { userId: "U-0004", points: 4, payload: null },
  ];

  const rankingsGlobal: ActivityRankingPending[] = [
    { userId: "U-0009", points: 341, payload: null },
    { userId: "U-0006", points: 298, payload: null },
    { userId: "U-0007", points: 269, payload: null },
    { userId: "U-0008", points: 247, payload: null },
    { userId: "U-0005", points: 178, payload: null },
  ];

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
            <h3 className="text-sm font-semibold text-muted-foreground px-1">{titleAmigos}</h3>

            <RankingTable
              rankings={calculateRanking(rankingsAmigos)}
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
            <h3 className="text-sm font-semibold text-muted-foreground px-1">{titleGlobal}</h3>
            <RankingTable
              rankings={calculateRanking(rankingsGlobal)}
              layout="simple"
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
