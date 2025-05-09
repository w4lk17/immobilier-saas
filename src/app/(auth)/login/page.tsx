// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth/components/LoginForm"; // Le nouveau LoginForm basé sur Card

export default function LoginPage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background md:bg-muted p-6 md:p-10"> {/* Ajusté bg */}
			<div className="w-full max-w-sm md:max-w-3xl">
				<LoginForm />
			</div>
		</div>
	)
}