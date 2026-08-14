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
import { FrontendTenant } from "@/types";

interface ComboboxTenantsProps {
	tenants: FrontendTenant[];
	value?: number | null;
	onChange: (tenantUserId: number | undefined) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyResultText?: string;
	disabled?: boolean;
	className?: string;
}

function getTenantLabel(tenant: FrontendTenant) {
	const fullName = `${tenant.firstName || ""} ${tenant.lastName || ""}`.trim();
	return fullName || tenant.email;
}

export function ComboboxTenants({
	tenants,
	value,
	onChange,
	placeholder = "Sélectionner un locataire...",
	searchPlaceholder = "Rechercher un locataire...",
	emptyResultText = "Aucun locataire trouvé.",
	disabled = false,
	className,
}: ComboboxTenantsProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");

	const selectableTenants = React.useMemo(
		() => tenants.filter((tenant) => !!tenant.tenantProfile?.id),
		[tenants]
	);

	const selectedTenant = selectableTenants.find(
		(tenant) => tenant.id === value
	);

	const filteredTenants = React.useMemo(() => {
		if (!searchQuery) return selectableTenants;

		const lowercasedQuery = searchQuery.toLowerCase();
		return selectableTenants.filter((tenant) => {
			const fullName = getTenantLabel(tenant).toLowerCase();
			const email = tenant.email.toLowerCase();
			const phoneNumber = tenant.phoneNumber?.toLowerCase() ?? "";

			return (
				fullName.includes(lowercasedQuery) ||
				email.includes(lowercasedQuery) ||
				phoneNumber.includes(lowercasedQuery)
			);
		});
	}, [selectableTenants, searchQuery]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label={placeholder}
					className={cn(
						"w-full justify-between",
						selectedTenant ? "text-foreground" : "text-muted-foreground",
						className
					)}
					disabled={disabled}
				>
					{selectedTenant
						? `${getTenantLabel(selectedTenant)} (${selectedTenant.email})`
						: placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
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
								{filteredTenants.map((tenant) => {
									if (!tenant.tenantProfile?.id) return null;

									return (
										<CommandItem
											key={tenant.id}
											value={`${tenant.id}-${getTenantLabel(tenant)}-${tenant.email}`}
											onSelect={() => {
												onChange(tenant.id);
												setSearchQuery("");
												setOpen(false);
											}}
											className="cursor-pointer"
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													value === tenant.id ? "opacity-100" : "opacity-0"
												)}
											/>
											<div className="flex flex-col">
												<span>{getTenantLabel(tenant)}</span>
												<span className="text-xs text-muted-foreground">
													{tenant.email}
													{tenant.phoneNumber ? ` · ${tenant.phoneNumber}` : ""}
												</span>
											</div>
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
