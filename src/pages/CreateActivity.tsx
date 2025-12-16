import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker24h } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TopBar from "@/components/ui/TopBar";
import { activities, sportsList } from "@/data/app-data";
import {} from "@radix-ui/react-select";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";

interface InputContainerProps {
  children: ReactNode;
}

function InputContainer(props: InputContainerProps) {
  return <div className="grid gap-2">{props.children}</div>;
}

export default function CreateActivity() {
  const [startNow, setStartNow] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* TopBar*/}
      <TopBar title="Crea una actividad" to="/" />

      {/* Nombre actividad */}
      <InputContainer>
        <Label htmlFor="name">Nombre actividad</Label>
        <Input id="name" required placeholder="Nombre descriptivo"></Input>
      </InputContainer>

      {/* Deporte */}

      <InputContainer>
        <Label htmlFor="sport">Deporte</Label>
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un deporte" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {sportsList.map((item) => (
                <SelectItem key={item.value} value={item.value} id="sport">
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputContainer>

      {/* Descripción */}
      <InputContainer>
        <Label htmlFor="description">Descripción de la actividad</Label>
        <Textarea
          id="description"
          required
          rows={4}
          placeholder="Descripción en detalle de la actividad a realizar"
        />
      </InputContainer>

      {/* Máximo de participantes */}
      <InputContainer>
        <Label htmlFor="participants">Máximo de participantes</Label>
        <Input id="participants" required type="number" min={1} />
      </InputContainer>

      {/* Nivel de la actividad */}
      <InputContainer>
        <Label htmlFor="level">Nivel de la actividad</Label>
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un deporte" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="profesional" id="level">
                Profesional
              </SelectItem>
              <SelectItem value="intermedio" id="level">
                Amateur
              </SelectItem>
              <SelectItem value="amateur" id="level">
                Casual
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </InputContainer>

      {/* Checkbox */}
      <InputContainer>
        <div className="flex items-center gap-4">
          <Checkbox
            id="start-after-creation"
            value=""
            checked={startNow}
            onCheckedChange={(e) => setStartNow(!!e)}
          />
          <Label htmlFor="start-after-creation">¿Empezar actividad tras creación?</Label>
        </div>
      </InputContainer>

      {/* Fecha*/}
      <InputContainer>
        <Label htmlFor="date">Fecha de actividad</Label>
        <DateTimePicker24h id="date" disabled={startNow} />
      </InputContainer>

      {/* Crear */}
      <Button asChild>
        <Link to={`/activity/${activities[0].id}/${startNow ? "live" : "summary"}`}>
          Crear actividad
        </Link>
      </Button>
    </div>
  );
}
