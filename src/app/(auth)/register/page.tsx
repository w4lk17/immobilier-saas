
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center">Inscription</h2>
				<RegisterForm />
				<p className="text-center text-sm text-muted-foreground">
					Vous avez dejas un compte?{' '}
					<Link href="/login" className="font-medium text-primary hover:underline">
						Connectez-vous
					</Link>
				</p>
			</div>
		</div>
	);
}