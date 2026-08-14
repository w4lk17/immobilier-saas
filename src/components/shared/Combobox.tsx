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
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Props pour le Combobox Générique.
 * @template T Le type de données des items dans la liste.
 */
interface ComboboxProps<T> {
	// Le tableau d'objets à afficher comme items.
	items: T[];
	// La valeur actuellement sélectionnée (généralement un ID).
	value?: string | number | null;
	// Fonction appelée lorsque la sélection change. Retourne la nouvelle valeur.
	onChange: (value: string | number | undefined) => void;
	// Fonction pour extraire la valeur unique (ID) de chaque item.
	valueAccessor: (item: T) => string | number;
	// Fonction pour extraire le texte à afficher pour chaque item.
	displayAccessor: (item: T) => string;
	// Placeholder pour le bouton lorsque rien n'est sélectionné.
	placeholder?: string;
	// Placeholder pour le champ de recherche.
	searchPlaceholder?: string;
	// Texte à afficher si la recherche ne donne aucun résultat.
	emptyResultText?: string;
	// Pour désactiver le combobox.
	disabled?: boolean;
	// Classes CSS supplémentaires pour le bouton déclencheur.
	className?: string;
}

export function Combobox<T>({
	items,
	value,
	onChange,
	valueAccessor,
	displayAccessor,
	placeholder = "Sélectionner un élément...",
	searchPlaceholder = "Rechercher un élément...",
	emptyResultText = "Aucun résultat.",
	disabled = false,
	className,
}: ComboboxProps<T>) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");
	const triggerRef = React.useRef<HTMLButtonElement | null>(null);
	const [popoverWidth, setPopoverWidth] = React.useState<number>();

	// Mettre à jour la largeur lors de l'ouverture du popover
	React.useEffect(() => {
		if (open && triggerRef.current) {
			setPopoverWidth(triggerRef.current.offsetWidth);
		}
	}, [open]);

	// Trouver l'item actuellement sélectionné pour l'afficher dans le bouton
	const selectedItem = React.useMemo(
		() => items.find((item) => valueAccessor(item) === value),
		[items, value, valueAccessor]
	);

	// Filtrer les items en fonction de la recherche de l'utilisateur
	const filteredItems = React.useMemo(() => {
		if (!searchQuery) {
			return items;
		}
		const lowercasedQuery = searchQuery.toLowerCase();
		return items.filter((item) =>
			displayAccessor(item).toLowerCase().includes(lowercasedQuery)
		);
	}, [items, searchQuery, displayAccessor]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label={placeholder}
					className={cn(
						"w-full justify-between",
						selectedItem ? "text-foreground" : "text-muted-foreground",
						className
					)}
					disabled={disabled}
				>
					{selectedItem ? displayAccessor(selectedItem) : placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			{/* La largeur du PopoverContent suit celle du bouton */}
			<PopoverContent
				className="max-h-[--radix-popover-content-available-height] p-0"
				style={popoverWidth ? { width: popoverWidth } : undefined}
			>
				<Command shouldFilter={false}>
					<CommandInput
						value={searchQuery}
						onValueChange={setSearchQuery}
						placeholder={searchPlaceholder}
					/>
					<CommandList>
						<CommandEmpty>{emptyResultText}</CommandEmpty>
						<ScrollArea className="max-h-60">
							<CommandGroup>
								{filteredItems.map((item, index) => {
									const itemValue = valueAccessor(item);
									const itemDisplay = displayAccessor(item);
									return (
										<CommandItem
											key={index}
											value={itemDisplay}
											onSelect={() => {
												onChange(itemValue === value ? undefined : itemValue);
												setSearchQuery("");
												setOpen(false);
											}}
											className="cursor-pointer"
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													value === itemValue ? "opacity-100" : "opacity-0"
												)}
											/>
											{itemDisplay}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
