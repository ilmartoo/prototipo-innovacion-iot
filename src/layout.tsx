import paulina from "@/assets/paulina.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { House } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Outlet } from "react-router";

export default function Layout() {
  const isMobile = useIsMobile();

  return (
    <div className="max-w-110 m-auto">
      <header className="py-4 border-b">
        <NavigationMenu viewport={isMobile}>
          <div className="flex justify-between">
            <NavigationMenuList>
              <NavItem to="/">
                <House className="text-foreground size-6" />
              </NavItem>
              <NavItem to="/activities">Mis actividades</NavItem>
              <NavItem to="/rankings">Rankings</NavItem>
            </NavigationMenuList>
            <NavigationMenuList>
              <NavItem to="/profile">
                <ImagenPerfil src={paulina} nombre="Paulina R." nivel={37} />
              </NavItem>
            </NavigationMenuList>
          </div>
        </NavigationMenu>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

interface ImagenPerfilProps {
  src: string;
  nombre: string;
  nivel: number;
}

function ImagenPerfil(props: ImagenPerfilProps) {
  return (
    <div className="flex gap-2 items-middle">
      <Avatar className="block align-middle">
        <AvatarImage src={props.src} alt="Imagen de perfil" />
      </Avatar>
      <div className="flex flex-col">
        <h2>{props.nombre}</h2>
        <h3 className="text-muted-foreground">Nivel {props.nivel}</h3>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  children: ReactNode;
}

function NavItem(props: NavItemProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
        <Link to={props.to}>{props.children}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
