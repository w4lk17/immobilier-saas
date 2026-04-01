import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dateUtils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface DatePickerProps {
	className?: string;
	field: {
		value: string | null;
		onChange(value: string | null): void;
	};
}

export function DatePicker({ className, field }: DatePickerProps) {
	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			field.onChange(date.toISOString());
		} else {
			field.onChange(null);
		}
	};

	const selectedDate = field.value ? new Date(field.value) : undefined;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[240px] pl-3 text-left font-normal",
						!field.value && "text-muted-foreground"
					)}
				>
					{field.value ? (
						formatDate(field.value, 'P')
					) : (
						<span>Sélectionner</span>
					)}
					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={handleDateSelect}
					endMonth={new Date(2036, 11, 31)}
					// disabled={(date) =>
					// 	date > new Date() || date < new Date("1900-01-01")
					// }

					captionLayout="dropdown"
				/>
			</PopoverContent>
		</Popover>
	);
}
