export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-svh bg-muted/40 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto grid min-h-[calc(100svh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border bg-card shadow-xl lg:grid-cols-2">
				<div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
					<div className="w-full max-w-md">{children}</div>
				</div>
				<div className="relative hidden lg:block">
					<div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.16),transparent_40%)]" />
					<div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
						<div className="text-2xl font-medium uppercase tracking-[0.2em] text-white/80">
							Hofeti
						</div>
						<div className="space-y-4">
							<h2 className="text-3xl font-semibold leading-tight">
								Gerez vos loyers et contrats dans un seul espace.
								{/* Gerez vos biens et contrats dans un seul espace. */}
							</h2>
							<p className="max-w-md text-sm text-white/85">
								Suivi des loyers et paiements, avec automatisation des rappels de loyer pour une gestion simplifiée et efficace.
								{/* Suivi des locataires, paiements et operations quotidiennes avec une
								interface claire et moderne. */}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
}