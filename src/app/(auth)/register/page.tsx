// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/features/auth/components/RegisterForm"; // Le nouveau RegisterForm basé sur Card

export default function RegisterPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background md:bg-muted p-6 md:p-10"> {/* Ajusté bg */}
			<div className="w-full max-w-sm md:max-w-3xl">
				<RegisterForm /> {/* Affiche la carte avec les 2 colonnes */}
			</div>
		</div>
	)
}