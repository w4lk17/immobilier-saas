"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BadgeCheck, ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatDateTime } from "@/lib/dateUtils";
import Link from "next/link";

interface UserDropdownProps {
  className?: string;
}

export function UserDropdown({ className }: UserDropdownProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          disabled={isLoading}
        >
          <Avatar>
            <AvatarImage src="" alt={fullName} />
            <AvatarFallback>
              <User/>
              {/* {initials} */}
              </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{fullName}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              <span className="truncate text-xs text-muted-foreground">
                {formatDateTime(user.createdAt)}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <BadgeCheck className="h-4 w-4" />
              Compte
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? 'Déconnexion...' : 'Déconnexion'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
