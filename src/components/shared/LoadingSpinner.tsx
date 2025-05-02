// TODO: generate for me a loadingspinner  component using shadcn/ui
import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Loader2 className="animate-spin" />
		</div>
	);
}
