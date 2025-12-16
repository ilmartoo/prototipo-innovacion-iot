import TopBar from "@/components/ui/TopBar";
import {useState } from "react";
import {sportsList} from "@/data/app-data";

const Label = ({ children}: {children: React.ReactNode}) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {children}
    </label>
);


export default function CreateActivities() {
  const [sport, setSport] = useState("");
  
  const [startNow, setStartNow] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* TopBar*/}
      <TopBar title="Crea una actividad" to="/" />

      <div className="px-5 py-6 max-w-lg mx-auto flex flex-col gap-6">
        
        {/* Nombre actividad */}
        <div>
          <Label>Nombre actividad</Label>
          <input 
            type="text" 
            placeholder="Nombre descriptivo"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>

        {/* Deporte */}
        <div>
        <Label>Deporte</Label>
        <div className="relative">
            <select 
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm appearance-none bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/5"
            >
            <option value="" disabled>Selecciona un deporte</option>
            
            {sportsList.map((item) => (
                <option key={item.value} value={item.value}>
                {item.label}
                </option>
            ))}

            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
        </div>

        {/* Descripción */}
        <div>
          <Label>Descripción de la actividad</Label>
          <textarea 
            rows={4}
            placeholder="Descripción en detalle de la actividad a realizar"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>

        {/* Máximo de participantes */}
        <div>
          <Label>Máximo de participantes</Label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black/5">
              <option value="12">12</option>
              <option value="10">10</option>
              <option value="8">8</option>
              <option value="4">4</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Nivel de la actividad */}
        <div>
          <Label>Nivel de la actividad</Label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black/5">
              <option value="profesional">Profesional</option>
              <option value="intermedio">Intermedio</option>
              <option value="amateur">Amateur</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="startNow"
            checked={startNow}
            onChange={(e) => setStartNow(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer accent-black"
          />
          <label htmlFor="startNow" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            ¿Empezar actividad tras creación?
          </label>
        </div>

        {/* Fecha*/}
        <div>
          <Label>Fecha de actividad</Label>
          <div className="relative">
            <input 
              type="datetime-local" 
              disabled={startNow}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 
                ${startNow ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-900'}
              `}
            />
             {!startNow && (
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                </div>
             )}
          </div>
        </div>

        {/* Crear */}
        <div className="mt-4 flex justify-center">
            <button 
                className="bg-gray-800 hover:bg-black text-white font-medium py-3 px-8 rounded-xl w-fit transition-colors"
            >
                Crear actividad
            </button>
        </div>

      </div>
    </div>
  );
}