import { useState } from "react";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

export default function ActivityData() {
  const [selectedPlayer, setSelectedPlayer] = useState("global");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <TopBar
        title="Datos de actividad"
      />

      {/* Card - Selector */}
      <div className="flex items-center gap-2 mb-6">
        <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="jugador1">Jugador 1</SelectItem>
            <SelectItem value="jugador2">Jugador 2</SelectItem>
            <SelectItem value="jugador3">Jugador 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card - Posicions en directo */}
      {/* Esto mo fixo chatgpt a partir da imagen, interesante */}
      <div className="flex justify-center mb-6">
        <svg
          width="300"
          height="200"
          viewBox="0 0 300 200"
          className="border border-gray-200 rounded-lg shadow-sm"
        >
          {/* Court background */}
          <rect width="300" height="200" fill="#FF8C00" />
          
          {/* Green border */}
          <rect x="0" y="0" width="300" height="200" fill="none" stroke="#4CAF50" strokeWidth="8" />
          
          {/* Center line */}
          <line x1="150" y1="0" x2="150" y2="200" stroke="white" strokeWidth="2" strokeDasharray="4,4" />
          
          {/* Center circle */}
          <circle cx="150" cy="100" r="30" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4,4" />
          <circle cx="150" cy="100" r="8" fill="#FFD700" />
          
          {/* Left court area */}
          <path
            d="M 0 50 Q 60 50 60 100 Q 60 150 0 150"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          
          {/* Right court area */}
          <path
            d="M 300 50 Q 240 50 240 100 Q 240 150 300 150"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          
          {/* Left basket area */}
          <rect x="0" y="80" width="20" height="40" fill="#4CAF50" />
          
          {/* Right basket area */}
          <rect x="280" y="80" width="20" height="40" fill="#4CAF50" />
          
          {/* Players */}
          {/* Red team */}
          <circle cx="80" cy="60" r="6" fill="#FF4444" stroke="white" strokeWidth="1" />
          <circle cx="120" cy="40" r="6" fill="#FF4444" stroke="white" strokeWidth="1" />
          <circle cx="100" cy="120" r="6" fill="#FF4444" stroke="white" strokeWidth="1" />
          <circle cx="70" cy="160" r="6" fill="#FF4444" stroke="white" strokeWidth="1" />
          
          {/* Blue team */}
          <circle cx="220" cy="80" r="6" fill="#4488FF" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Card - Turno actual */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Turno actual
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mx-4" />
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            13 s restantes
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            SAMUEL L.
          </div>
        </div>
      </div>

   {/* Cards Datos*/}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          value="13m 45s"
          label="TIEMPO TURNO"
          progress={75}
          progressColor="red"
        />      
        <StatCard
          value="60%"
          label="LANZAMIENTOS EXITOSOS"
          progress={60}
          progressColor="blue"
        />
      </div>
    </div>
  );
}