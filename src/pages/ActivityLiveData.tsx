import { useState } from "react";
import StatCard from "@/components/ui/StatCard";
import TopBar from "@/components/ui/TopBar";
import { activityRankings, users } from "@/data/app-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, ChevronDown } from "lucide-react";

export default function ActivityData() {
  const [selectedPlayer, setSelectedPlayer] = useState("global");

  const playersData = activityRankings.map(ranking => ({
    id: ranking.position,
    name: ranking.name.split(' ').slice(0, 2).map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
    goals: ranking.goals,
    position: ranking.playingPosition,
    avatar: ranking.picture,
    userId: ranking.userId
  }));

  const selectedPlayerData = selectedPlayer !== "global" 
    ? playersData.find(p => p.userId === selectedPlayer)
    : null;

  const renderPlayerView = () => {
    if (!selectedPlayerData) return null;
    
    return (
      <div>
        {/* Card - Posicions en directo */}
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

            {/* Red team */}
            <circle cx="100" cy="120" r="6" fill="#FF4444" stroke="white" strokeWidth="1" />
            
            {/* Blue team */}
            <circle cx="220" cy="80" r="6" fill="#4488FF" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* Estadísticas do xogador */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            value="23 s"
            label="TIEMPO TURNO"
            progress={75}
            progressColor="red"
          />
          <StatCard
            value="2"
            label="TURNOS EN POSICIÓN ACTUAL"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            value="60%"
            label="LANZAMIENTOS EXITOSOS"
            progress={60}
            progressColor="blue"
          />
          <StatCard
            value="2"
            label="TIROS FUERA"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            value={`${selectedPlayerData.goals}`}
            label="GOLES"
          />
          <StatCard
            value="2"
            label="RACHA DE GOLES"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            value="3,44 m"
            label="DISTANCIA MEDIA DE TIRO"
          />
          <StatCard
            value="5,13 m"
            label="DISTANCIA ACTUAL"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <TopBar
        title="Datos de actividad"
        titleClassName="text-lg font-bold tracking-tight"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-32 justify-between text-sm">
              {selectedPlayer === "global" ? "Global" : 
               users.find(u => u.id === selectedPlayer)?.name || "Seleccionar"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            <DropdownMenuItem onClick={() => setSelectedPlayer("global")}>
              Global
            </DropdownMenuItem>
            {users.map(user => (
              <DropdownMenuItem key={user.id} onClick={() => setSelectedPlayer(user.id)}>
                {user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TopBar>

      {/* Renderizado condicional */}
      {selectedPlayer === "global" ? (
        <>
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
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              Turno actual
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-muted-foreground mx-4" />
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              13 s restantes
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              SAMUEL L.
            </div>
          </div>
        </CardContent>
      </Card>

   {/* Cards Datos*/}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          value="13m 45s"
          label="TIEMPO - 15 MIN"
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

      {/* Ranking de xogadores */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-3">Ranking</h2>
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 pb-3 text-sm font-medium text-muted-foreground border-b">
              <div className="w-12">Goles</div>
              <div className="flex-1">Jugador</div>
              <div>Posición</div>
            </div>
          
          {playersData.map((player, index) => (
            <div key={player.id}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="w-12 text-xl font-bold">{player.goals}</div>
                <div className="flex-1 flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{player.name}</span>
                </div>
                <div className="text-muted-foreground">{player.position}</div>
              </div>
              {index < playersData.length - 1 && <Separator />}
            </div>
          ))}
          </CardContent>
        </Card>
      </div>
        </>
      ) : (
        renderPlayerView()
      )}
    </div>
  );
}