import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TopBar from "@/components/ui/TopBar";
import { currentUser } from "@/data/app-data";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import medal100bn from "@/assets/medals/100_activities_bn.webp";
import medal10 from "@/assets/medals/10_activities.webp";
import medal50 from "@/assets/medals/50_activities.webp";
import racha10_bn from "@/assets/medals/racha_10_bn.webp";
import racha5 from "@/assets/medals/racha_5.webp";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { activitiesToNextLevel } from "@/data/models/user";

interface MedalCardProps {
  img: string;
  title: string;
  description: string;
  isLocked?: boolean;
}

function MedalCard({ img, title, description, isLocked = false }: MedalCardProps) {
  return (
    <Card className="p-4 gap-4 *:p-0">
      <CardContent>
        <div className="overflow-hidden bg-black rounded-xl">
          <img
            src={img}
            alt={title}
            className={`w-full ${isLocked ? "opacity-60 grayscale" : ""}`}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div>
          <div className="text-base font-bold text-gray-900">{title}</div>
          <div className="text-sm text-gray-500 font-normal">{description}</div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function MyProfile() {
  const neededActivitiesToNextLevel = activitiesToNextLevel(
    currentUser.level,
    currentUser.completedActivities
  );
  const levelCompletitionPercentage =
    (currentUser.completedActivities /
      (currentUser.completedActivities + neededActivitiesToNextLevel)) *
    100;

  return (
    <>
      {/* --- HEADER --- */}
      <TopBar title="Mi perfil" to="/" />

      {/* Avatar e Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20 border border-gray-100 shadow-sm">
          <AvatarImage src={currentUser.picture} alt="Imagen de perfil" className="object-cover" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold text-gray-900 leading-tight">
            {currentUser.name} {currentUser.surname}
          </span>
          <span className="text-sm text-gray-500 font-normal">{currentUser.birthDate}</span>
        </div>
      </div>

      {/* --- NIVEL CARD --- */}
      <StatCard
        value={`Nivel ${currentUser.level}`}
        label={`Completa ${neededActivitiesToNextLevel} más para subir de nivel`}
        progress={levelCompletitionPercentage}
      />

      {/* --- MEDALLERO --- */}
      <SectionTitle>Medallero</SectionTitle>

      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-2 gap-4">
        <MedalCard
          img={medal50}
          title="50 actividades"
          description="¡Has completado 50 actividades!"
        />
        <MedalCard
          img={medal10}
          title="10 actividades"
          description="¡Has completado 10 actividades!"
        />
        <MedalCard
          img={racha5}
          title="Racha de 5 días"
          description="¡Has completado actividades 5 días seguidos!"
        />
      </div>

      {/* --- MEDALLAS EN PROCESO --- */}
      <SectionTitle>Medallas en proceso</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <MedalCard
          img={medal100bn}
          title="100 Actividades"
          description="Completa 23 actividades más."
          isLocked={true}
        />
        <MedalCard
          img={racha10_bn}
          title="Racha de 10 días"
          description="Completa actividades 3 días más."
          isLocked={true}
        />
      </div>
    </>
  );
}
