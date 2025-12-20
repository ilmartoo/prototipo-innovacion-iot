import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker24h } from "@/components/ui/datetime-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import {
  defaultActivity,
  sportList as sportsList,
  userLevelList as userLevelsList,
} from "@/data/app-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const formSchemaBase = z.object({
  title: z.string().min(1, "Introduce un título para tu actividad"),
  sport: z.enum(sportsList, "Define el deporte base"),
  description: z.string().min(1, "Describe tu actividad"),
  maxParticipants: z
    .number("Establece el máximo de participantes de la actividad")
    .min(1, "La actividad debe tener al menos un participante"),
  level: z.enum(userLevelsList, "Define el nivel de experiencia"),
});

const formSchema = z.discriminatedUnion("startNow", [
  // Empieza ahora
  formSchemaBase.extend({
    startNow: z.literal(true),
  }),
  // Empieza más tarde
  formSchemaBase.extend({
    startNow: z.literal(false),
    dateTime: z
      .date("Establece la fecha y hora de la actividad")
      .min(new Date(), "La actividad debe empezar en el futuro"),
  }),
]);

export default function CreateActivity() {
  const startNow = false;

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      sport: undefined,
      description: "",
      maxParticipants: undefined,
      level: undefined,
      startNow: startNow,
      dateTime: undefined,
    },
  });
  const [isStartNow, setStartNow] = useState(startNow);

  function onSubmit() {
    navigate(`/activity/${defaultActivity.id}`);
  }

  return (
    <>
      <TopBar title="Crea una actividad" to="/" />
      <Form {...form}>
        <form
          onSubmit={(e) => {
            console.log(form.getValues());

            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          {/* Nombre actividad */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre actividad</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="false"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Título descriptivo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Deporte */}
          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deporte</FormLabel>
                <FormControl>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un deporte" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(sportsList).map(([sport, value]) => (
                          <SelectItem key={value} value={value} id="sport">
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción de la actividad</FormLabel>
                <FormControl>
                  <Textarea
                    autoComplete="false"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    rows={4}
                    placeholder="Descripción en detalle de la actividad a realizar"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Máximo de participantes */}
          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo de participantes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    autoComplete="false"
                    name={field.name}
                    value={field.value}
                    onChange={(e) => form.setValue(field.name, +e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nivel de la actividad */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de la actividad</FormLabel>
                <FormControl>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(userLevelsList).map(([level, value]) => (
                          <SelectItem key={value} value={value} id="level">
                            {level}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Checkbox */}
          <FormField
            control={form.control}
            name="startNow"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Checkbox
                      value=""
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                        setStartNow(!!e);
                      }}
                    />
                  </FormControl>
                  <FormLabel>¿Empezar actividad tras creación?</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha */}
          <FormField
            control={form.control}
            name="dateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de la actividad</FormLabel>
                <FormControl>
                  <DateTimePicker24h
                    name={field.name}
                    value={field.value}
                    onChange={(date) => form.setValue("dateTime", date!)}
                    disabled={isStartNow}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Crear actividad
          </Button>
        </form>
      </Form>
    </>
  );
}
