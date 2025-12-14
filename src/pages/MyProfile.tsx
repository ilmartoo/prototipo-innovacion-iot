import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { currentUser } from "@/data/app-data";
import { useNavigate } from "react-router"; // Asegúrate de que usas 'react-router-dom' si es web
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// IMÁGENES
// Nota: Si usas Vite, esto son strings. Si usas Next.js, a veces son objetos.
// Para asegurar compatibilidad, trataremos 'img' como string en la interfaz.
import medal50 from "@/assets/medals/50_activities.png";
import medal10 from "@/assets/medals/10_activities.png";
import medal100bn from "@/assets/medals/100_activities_bn.png";
import racha5 from "@/assets/medals/racha_5.png";
import racha10_bn from "@/assets/medals/racha_10_bn.png";

// 1. AQUÍ SOLUCIONAMOS EL ERROR DE TYPESCRIPT
// Definimos la "forma" que deben tener los datos de la carta
interface MedalCardProps {
  img: string;        // La imagen es una ruta de texto
  title: string;      // El título es texto
  description: string;// La descripción es texto
  isLocked?: boolean; // Opcional (?), es verdadero o falso
}

// Componente reutilizable con tipos definidos
const MedalCard = ({ img, title, description, isLocked = false }: MedalCardProps) => (
  <Card className="rounded-[20px] border border-gray-200 shadow-sm overflow-hidden h-full bg-white">
    <CardContent className="flex flex-col gap-3 p-4 items-start text-left h-full">
      
      {/* CAJA NEGRA CUADRADA PARA LA FOTO (Clave para el diseño) */}
      {/* 'w-full aspect-square' fuerza a que sea un cuadrado perfecto que llena el ancho */}
      <div className="w-full aspect-square bg-black rounded-2xl flex items-center justify-center p-2">
        <img
          src={img}
          alt={title}
          className={`w-full h-full object-contain drop-shadow-md ${isLocked ? "opacity-60 grayscale" : ""}`}
        />
      </div>
      
      {/* Textos alineados a la izquierda */}
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
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto pb-10 px-4 pt-4 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6">
        {/* Botón atrás alineado con título */}
        <div className="relative flex items-center justify-center w-full mb-2">
          <button
            onClick={() => navigate("/")}
            /* Clases clave explicadas abajo */
            className="absolute left-0 -ml-2 p-2 rounded-full text-black transition-all hover:bg-black/5 active:scale-90 cursor-pointer"
            aria-label="Volver atrás"
          >
            <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
          </button>
          <h1 className="text-xl font-bold text-black w-full text-left pl-12">Mi perfil</h1>
          {/* El pr-6 compensa visualmente el botón de la izquierda para centrar el texto si quisieras, 
              o puedes usar text-left y quitar 'justify-center' si prefieres el estilo alineado a izq como la foto */}
        </div>

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

      {/* --- NIVEL CARD (Gris muy claro) --- */}
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

          {/* Barra de progreso estilo iOS/Android */}
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
          {/* Este elemento ocupará su propio espacio en la siguiente fila automáticamente */}
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