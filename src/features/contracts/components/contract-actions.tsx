// "use client";

// import { useState } from "react";
// import { MoreVertical, Eye, Pencil, Trash } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import Link from "next/link";
// import { useDeleteContract } from "../hooks/useContracts.hooks";
// import { ContractWithRelations } from "@/types";

// export function ContractActions({ contract }: { contract: ContractWithRelations }) {
//   const [showDelete, setShowDelete] = useState(false);
//   const { mutate: deleteContract, isPending } = useDeleteContract();

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuItem>
//             <Link href={`/contracts/${contract.id}`} className="flex items-center w-full"><Eye className="mr-2 h-4 w-4" /> Voir</Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Link href={`/contracts/${contract.id}/edit`} className="flex items-center w-full"><Pencil className="mr-2 h-4 w-4" /> Modifier</Link>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem className="text-red-600" onClick={() => setShowDelete(true)}>
//             <Trash className="mr-2 h-4 w-4" /> Supprimer
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Supprimer le contrat ?</AlertDialogTitle>
//             <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Annuler</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => deleteContract(contract.id)}
//               disabled={isPending}
//               className="bg-destructive text-destructive-foreground"
//             >
//               {isPending ? "Suppression..." : "Supprimer"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }