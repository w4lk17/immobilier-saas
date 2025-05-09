
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Composant Shadcn
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Composant Shadcn
import { Building, Users, LogIn, FileText, CreditCard, Wrench } from 'lucide-react'; // Icônes Lucide
import { ModeSwitcher } from '@/components/shared/ModeSwitcher'; // Composant à créer

// Composant simple pour l'en-tête (peut être extrait dans /components/shared/Header.tsx)
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Building className="h-6 w-6" /> {/* Ou une icône de logo */}
            <span className="hidden font-bold sm:inline-block">GestImmo Pro</span> {/* Nom de votre app */}
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* Liens de navigation futurs */}
            {/* <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Fonctionnalités</Link> */}
            {/* <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Tarifs</Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeSwitcher /> {/* Bouton pour changer le thème */}
          <Button variant="outline" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Inscription</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// Composant simple pour le pied de page (peut être extrait dans /components/shared/Footer.tsx)
function LandingFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          © {new Date().getFullYear()} GestImmo Pro. Tous droits réservés. Développé avec ❤️.
        </p>
      </div>
    </footer>
  );
}


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Section Héros */}
        <section className="py-20 md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-4">
              Gérez vos biens immobiliers <span className="text-primary">sans effort</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-8">
              La plateforme tout-en-un pour propriétaires, gestionnaires et locataires. Simplifiez la gestion locative, les paiements et la maintenance.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/register">Commencer gratuitement</Link>
              </Button>
              {/* <Button size="lg" variant="outline">
                Découvrir plus
              </Button> */}
            </div>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section id="features" className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
              Une solution complète pour tous
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Propriétaires
                  </CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Suivez les paiements de loyers, gérez les dépenses, visualisez la rentabilité de vos biens et communiquez facilement.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature Card 2 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Locataires
                  </CardTitle>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Payez votre loyer en ligne, consultez vos contrats, signalez des problèmes et échangez avec votre gestionnaire.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature Card 3 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Gestionnaires
                  </CardTitle>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Centralisez la gestion des propriétés, contrats, paiements et demandes de maintenance pour vos clients.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Call to Action (Optionnelle) */}
        <section className="py-16 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Prêt à simplifier votre gestion immobilière ?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mb-8">
              Rejoignez GestImmo Pro dès aujourd'hui et découvrez une nouvelle façon de gérer vos biens.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Créer mon compte</Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
