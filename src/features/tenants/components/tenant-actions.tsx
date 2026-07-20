// features/tenants/components/tenant-actions.tsx
"use client";

import { useState } from "react";
import { MoreVertical, Eye, Pencil, Trash } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useDeleteTenant } from "../hooks/useTenants.hooks";
import { User } from "@/types";

interface TenantActionsProps {
  tenant: User;
}

export function TenantActions({ tenant }: TenantActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { mutate: deleteTenant, isPending } = useDeleteTenant();

  const handleDelete = () => {
    deleteTenant(tenant.id);
    setShowDeleteAlert(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href={`/admin/tenants/${tenant.id}`} className="flex w-full items-center">
              <Eye className="mr-2 h-4 w-4" /> Voir détails
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={`/admin/tenants/${tenant.id}/edit`} className="flex w-full items-center">
              <Pencil className="mr-2 h-4 w-4" /> Modifier
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Désactiver
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog séparé pour la suppression */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Désactiver le locataire ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ce compte sera désactivé. Il ne pourra plus se connecter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className={buttonVariants({ variant: "destructive" })}
            // className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Suppression..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}