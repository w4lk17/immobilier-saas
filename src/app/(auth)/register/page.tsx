import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Suspense } from "react";

export default function RegisterPage() {
	return (
		<Suspense fallback={<div>Chargement...</div>}>
			<RegisterForm />
		</Suspense>
	);
}