import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/data/app-data";
import TopBar from "@/components/ui/TopBar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import medal50 from "@/assets/medals/50_activities.png";
import medal10 from "@/assets/medals/10_activities.png";
import medal100bn from "@/assets/medals/100_activities_bn.png";
import racha5 from "@/assets/medals/racha_5.png";
import racha10_bn from "@/assets/medals/racha_10_bn.png";


interface MedalCardProps {
  img: string;        
  title: string;      
  description: string;
  isLocked?: boolean; 
}

const MedalCard = ({ img, title, description, isLocked = false }: MedalCardProps) => (
  <Card className="rounded-[20px] border border-gray-200 shadow-sm overflow-hidden h-full bg-white">
    <CardContent className="flex flex-col gap-3 p-4 items-start text-left h-full">
      
      <div className="w-full aspect-square bg-black rounded-2xl flex items-center justify-center p-2">
        <img
          src={img}
          alt={title}
          className={`w-full h-full object-contain drop-shadow-md ${isLocked ? "opacity-60 grayscale" : ""}`}
        />
      </div>
      
      <div className="flex flex-col gap-1 w-full">
        <span className="text-base font-bold text-gray-900 leading-tight">
          {title}
        </span>
        <span className="text-sm text-gray-500 font-normal leading-snug">
          {description}
        </span>
      </div>

    </CardContent>
  </Card>
);

export default function MyProfile() {
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto pb-10 px-4 pt-4 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6">
        <TopBar title="Crea una actividad" to="/" />



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
            <span className="text-sm text-gray-500 font-normal">
              {currentUser.birthDate}
            </span>
          </div>
        </div>
      </div>

      {/* --- NIVEL CARD --- */}
      <Card className="mt-3 bg-gradient-to-t from-white-10 to-gray-200 border-0">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Nivel {currentUser.level}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pb-4 px-4">
          <div className="text-sm text-gray-500">
            Completa 6 actividades más para subir de nivel
          </div>

          {/* Barra de progreso*/}
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-gray-600 rounded-full"
              style={{ width: "40%" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* --- MEDALLERO --- */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-black">Medallero</h2>
        
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
      </div>

      {/* --- MEDALLAS EN PROCESO --- */}
      <div>
        <h2 className="text-lg font-bold mb-4 mt-4 text-black">Medallas en proceso</h2>

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
      </div>

    </div>
  );
}