
import { LoginForm } from '@/features/auth/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center">Connexion</h2>
				<LoginForm />
				<p className="text-center text-sm text-muted-foreground">
					Pas encore de compte?{' '}
					<Link href="/register" className="font-medium text-primary hover:underline">
						Inscrivez-vous
					</Link>
				</p>
			</div>
		</div>
	);
}