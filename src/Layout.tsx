import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import UserAvatar from "@/components/ui/UserAvatar";
import { currentUser } from "@/data/app-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { HouseIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Outlet } from "react-router";

export default function Layout() {
  const isMobile = useIsMobile();

  return (
    <div className="max-w-110 m-auto relative">
      <header className="flex items-center h-16 border-b px-2 sticky top-0 bg-background z-10">
        <NavigationMenu viewport={isMobile} className="max-w-none block">
          <NavigationMenuList className="w-full justify-start">
            <NavItem to="/" className="mr-4">
              <HouseIcon className="text-foreground size-6" />
            </NavItem>
            <NavItem to="/my-activities" accent>
              Mis actividades
            </NavItem>
            <NavItem to="/rankings">Rankings</NavItem>
            <ImagenPerfil
              to="/my-profile"
              src={currentUser.picture}
              nombre={currentUser.name}
              userId={currentUser.id}
              nivel={currentUser.level}
              className="ml-auto"
            />
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <main className="p-6 flex flex-col gap-4">
        <Outlet />
      </main>
    </div>
  );
}

interface ImagenPerfilProps {
  className?: string;
  src: string;
  userId: string;
  nombre: string;
  nivel: number;
  to: string;
}

function ImagenPerfil(props: ImagenPerfilProps) {
  return (
    <NavigationMenuItem className={props.className}>
      <Button asChild variant="ghost" className="flex flex-row gap-2 h-fit items-center px-2 py-1">
        <NavigationMenuLink href={props.to}>
          <UserAvatar className="grow" userId={props.userId} />
          <div className="flex flex-col">
            <h2>{props.nombre}</h2>
            <h3 className="font-normal text-muted-foreground">Nivel {props.nivel}</h3>
          </div>
        </NavigationMenuLink>
      </Button>
    </NavigationMenuItem>
  );
}

interface NavItemProps {
  className?: string;
  to: string;
  children: ReactNode;
  accent?: boolean;
}

function NavItem(props: NavItemProps) {
  return (
    <NavigationMenuItem className={props.className}>
      <Button asChild variant={props.accent ? "secondary" : "ghost"}>
        <NavigationMenuLink href={props.to}>{props.children}</NavigationMenuLink>
      </Button>
    </NavigationMenuItem>
  );
}
