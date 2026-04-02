'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Building,
	Menu,
	X,
	Mail,
	Phone,
	MapPin,
	LayoutDashboard,
	User,
} from 'lucide-react';
import { ModeSwitcher } from '@/components/shared/ModeSwitcher';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getRoleRedirectPath } from '@/lib/authUtils';


// Navigation Header
function LandingHeader() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { user, isAuthenticated } = useAuth();

	// Get the appropriate dashboard path based on user role
	const dashboardPath = isAuthenticated ? getRoleRedirectPath(user) : '/login';

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
				? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg'
				: 'bg-transparent'
				}`}
		>
			<div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
				<Link href="/" className="flex items-center space-x-3 group">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all duration-300" />
						<Building className="h-8 w-8 text-primary relative z-10" />
					</div>
					<span className="text-xl font-bold text-foreground tracking-tight">EstateFlow</span>
				</Link>

				<nav className="hidden lg:flex items-center space-x-8">
					{['Fonctionnalités', 'Tarifs', 'Témoignages'].map((item) => (
						<Link
							key={item}
							href={`#${item.toLowerCase()}`}
							className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
						>
							{item}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
						</Link>
					))}
				</nav>

				<div className="flex items-center space-x-4">
					<ModeSwitcher />
					<div className="hidden sm:flex items-center space-x-3">
						{isAuthenticated ? (
							<>
								<Button variant="outline" asChild>
									<Link href="/profile">
										<User className="h-4 w-4 mr-2" />
										{user?.firstName || 'Mon Compte'}
									</Link>
								</Button>
								<Button asChild className="font-semibold px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
									<Link href={dashboardPath}>
										<LayoutDashboard className="h-4 w-4 mr-2" />
										Tableau de Bord
									</Link>
								</Button>
							</>
						) : (
							<>
								<Button variant="ghost" asChild>
									<Link href="/login">Connexion</Link>
								</Button>
								<Button asChild className="font-semibold px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
									<Link href="/register">Essai Gratuit</Link>
								</Button>
							</>
						)}
					</div>
					<button
						className="lg:hidden text-foreground hover:text-primary p-2"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="lg:hidden bg-background/98 backdrop-blur-xl border-t border-border">
					<nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
						{['Fonctionnalités', 'Tarifs', 'Témoignages'].map((item) => (
							<Link
								key={item}
								href={`#${item.toLowerCase()}`}
								className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{item}
							</Link>
						))}
						<div className="flex flex-col space-y-3 pt-4 border-t border-border">
							{isAuthenticated ? (
								<>
									<Button variant="outline" asChild>
										<Link href="/profile">
											<User className="h-4 w-4 mr-2" />
											{user?.firstName || 'Mon Compte'}
										</Link>
									</Button>
									<Button asChild className="font-semibold">
										<Link href={dashboardPath}>
											<LayoutDashboard className="h-4 w-4 mr-2" />
											Tableau de Bord
										</Link>
									</Button>
								</>
							) : (
								<>
									<Button variant="outline" asChild>
										<Link href="/login">Connexion</Link>
									</Button>
									<Button asChild className="font-semibold">
										<Link href="/register">Essai Gratuit</Link>
									</Button>
								</>
							)}
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}

// Footer Component
function LandingFooter() {
	return (
		<footer className="bg-secondary/30 border-t border-border">
			<div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					<div>
						<Link href="/" className="flex items-center space-x-3 mb-6">
							<Building className="h-7 w-7 text-primary" />
							<span className="text-lg font-bold text-foreground">EstateFlow</span>
						</Link>
						<p className="text-muted-foreground text-sm leading-relaxed mb-6">
							Simplifiez vos opérations de gestion immobilière avec notre plateforme tout-en-un de confiance par des milliers de propriétaires.
						</p>
					</div>

					<div>
						<h4 className="text-foreground font-semibold mb-4">Produit</h4>
						<ul className="space-y-3">
							{['Fonctionnalités', 'Tarifs', 'Intégrations', 'API'].map((item) => (
								<li key={item}>
									<Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-foreground font-semibold mb-4">Entreprise</h4>
						<ul className="space-y-3">
							{['À Propos', 'Carrières', 'Blog', 'Contact'].map((item) => (
								<li key={item}>
									<Link href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-foreground font-semibold mb-4">Contact</h4>
						<ul className="space-y-3">
							<li className="flex items-center space-x-3 text-muted-foreground text-sm">
								<Mail className="h-4 w-4 text-primary" />
								<span>support@estateflow.com</span>
							</li>
							<li className="flex items-center space-x-3 text-muted-foreground text-sm">
								<Phone className="h-4 w-4 text-primary" />
								<span>+228 90 00 00 00</span>
							</li>
							<li className="flex items-center space-x-3 text-muted-foreground text-sm">
								<MapPin className="h-4 w-4 text-primary" />
								<span>Lomé, Togo</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} EstateFlow. Tous droits réservés.
					</p>
					<div className="flex space-x-6">
						{['Politique de Confidentialité', 'Conditions d\'Utilisation', 'Politique de Cookies'].map((item) => (
							<Link key={item} href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
								{item}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			{/* Header with navigation */}
			<LandingHeader />

			{/* Main content */}
			<main className="flex-1">
				{children}
			</main>

			{/* Footer */}
			<LandingFooter />
		</div>
	);
}
