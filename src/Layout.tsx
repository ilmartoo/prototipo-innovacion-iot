import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Toaster } from "@/components/ui/sonner";
import UserAvatar from "@/components/ui/UserAvatar";
import { currentUser } from "@/data/app-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { HouseIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Outlet, useLocation } from "react-router";

export default function Layout() {
  const isMobile = useIsMobile();
  const location = useLocation();

  function navAttrs(path: string) {
    return { to: path, accent: path === location.pathname };
  }

  return (
    <div className="max-w-110 m-auto relative">
      <header className="flex items-center h-16 border-b px-0.5 sm:px-1 sticky top-0 bg-background z-10">
        <NavigationMenu viewport={isMobile} className="max-w-none block">
          <NavigationMenuList className="w-full justify-start gap-0.5 sm:gap-1">
            <NavItem {...navAttrs("/")} className="mr-0.5 sm:mr-2">
              <HouseIcon className="size-6 text-base" />
            </NavItem>
            <NavItem {...navAttrs("/my-activities")}>Mis actividades</NavItem>
            <NavItem {...navAttrs("/rankings")}>Rankings</NavItem>
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
      <Toaster />
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
      <Button asChild variant="ghost" className="flex flex-row gap-2 h-fit items-center px-1 py-1">
        <NavigationMenuLink href={props.to}>
          <UserAvatar className="grow" userId={props.userId} />
          <div className="flex flex-col">
            <h2 className="font-semibold">{props.nombre}</h2>
            <h3 className="text-xs">Nivel {props.nivel}</h3>
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
      <Button asChild variant={props.accent ? "secondary" : "ghost"} className="px-1 sm:px-2 text-sm sm:text-base h-9 sm:h-10">
        <NavigationMenuLink href={props.to}>{props.children}</NavigationMenuLink>
      </Button>
    </NavigationMenuItem>
  );
}
