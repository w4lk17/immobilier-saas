"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList, // CommandList est utile pour la sémantique et le scroll
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area"; // Pour les longues listes
import { FrontendUserSnippet } from "@/types";

interface ComboboxUsersProps {
	users: FrontendUserSnippet[];
	value?: number | null; // L'ID de l'utilisateur sélectionné
	onChange: (userId: number | undefined) => void; // Callback avec l'ID ou undefined si désélectionné
	placeholder?: string;
	searchPlaceholder?: string;
	emptyResultText?: string;
	disabled?: boolean;
	className?: string; // Pour styler le bouton trigger
}

export function ComboboxUsers({
	users,
	value,
	onChange,
	placeholder = "Sélectionner un utilisateur...",
	searchPlaceholder = "Rechercher un utilisateur...",
	emptyResultText = "Aucun utilisateur trouvé.",
	disabled = false,
	className,
}: ComboboxUsersProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");

	const selectedUser = users.find((user) => user.id === value);

	const filteredUsers = React.useMemo(() => {
		if (!searchQuery) {
			return users;
		}
		const lowercasedQuery = searchQuery.toLowerCase();
		return users.filter((user) => {
			const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
			const email = user.email.toLowerCase();
			return (
				fullName.includes(lowercasedQuery) ||
				email.includes(lowercasedQuery)
			);
		});
	}, [users, searchQuery]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label={placeholder}
					className={cn("w-full justify-between", selectedUser ? "text-foreground" : "text-muted-foreground", className)}
					disabled={disabled}
				>
					{selectedUser
						? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""} (${selectedUser.email})`.trim()
						: placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
				<Command shouldFilter={false} > {/* Nous gérons le filtrage manuellement */}
					<CommandInput
						value={searchQuery}
						onValueChange={setSearchQuery}
						placeholder={searchPlaceholder}
					// L'icône de recherche peut être ajoutée ici si le design le permet,
					// sinon, le placeholder est suffisant.
					// icon={<Search className="h-4 w-4" />}
					/>
					<CommandList>
						<CommandEmpty>{emptyResultText}</CommandEmpty>
						<ScrollArea className="max-h-60"> {/* Limiter la hauteur et permettre le scroll */}
							<CommandGroup>
								{filteredUsers.map((user) => (
									<CommandItem
										key={user.id}
										// La valeur interne de CommandItem est utilisée pour la navigation clavier,
										// même si le filtrage est manuel. Elle doit être unique et pertinente.
										value={`${user.id}-${user.firstName || ""}-${user.lastName || ""}-${user.email}`}
										onSelect={() => {
											onChange(user.id);
											setSearchQuery(""); // Réinitialiser la recherche après sélection
											setOpen(false);
										}}
										className="cursor-pointer"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === user.id ? "opacity-100" : "opacity-0"
											)}
										/>
										<div className="flex flex-col">
											<span>{user.firstName || ""} {user.lastName || ""}</span>
											<span className="text-xs text-muted-foreground">{user.email}</span>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
