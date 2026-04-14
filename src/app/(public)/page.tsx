'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Users,
  FileText,
  Receipt,
  Wrench,
  BarChart3,
  Shield,
  Check,
  ArrowRight,
  X,
  Star,
  Quote,
  Zap,
  Building2,
  Clock,
  Layers,
  Wallet,
  Smartphone
} from 'lucide-react';

// Animation hook for scroll reveal
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, delay = 0 }: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`group relative bg-card backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <div className="relative">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Pricing Card
// function PricingCard({ name, price, description, features, isPopular, cta, delay = 0 }: {
//   name: string;
//   price: string;
//   description: string;
//   features: string[];
//   isPopular?: boolean;
//   cta: string;
//   delay?: number;
// }) {
//   const { ref, isVisible } = useScrollReveal();

//   return (
//     <div
//       ref={ref}
//       className={`relative rounded-2xl transition-all duration-500 ${isPopular
//         ? 'bg-gradient-to-b from-primary/10 to-card border-2 border-primary/50 scale-105 z-10'
//         : 'bg-card border border-border hover:border-border'
//         } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//         }`}
//       style={{ transitionDelay: `${delay}ms` }}
//     >
//       {isPopular && (
//         <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//           <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
//             Plus Populaire
//           </span>
//         </div>
//       )}
//       <div className="p-8">
//         <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>
//         <p className="text-muted-foreground text-sm mb-6">{description}</p>
//         <div className="mb-6">
//           <span className="text-4xl font-bold text-foreground">{price}</span>
//           {price !== 'Sur Devis' && <span className="text-muted-foreground">/mois</span>}
//         </div>
//         <ul className="space-y-3 mb-8">
//           {features.map((feature, index) => (
//             <li key={index} className="flex items-start space-x-3">
//               <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
//               <span className="text-foreground text-sm">{feature}</span>
//             </li>
//           ))}
//         </ul>
//         <Button
//           className={`w-full font-semibold ${isPopular
//             ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
//             : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
//             }`}
//           asChild
//         >
//           <Link href="/register">{cta}</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }

function PricingCard({ name, price, description, features, isPopular, cta, delay = 0 }: {
  name: string;
  price: string;
  description: string;
  features: { text: string; included: boolean }[]; // Changement ici : tableau d'objets
  isPopular?: boolean;
  cta: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl transition-all duration-500 h-full flex flex-col ${isPopular
        ? 'bg-gradient-to-b from-primary/10 to-card border-2 border-primary/50 scale-105 z-10'
        : 'bg-card border border-border hover:border-border'
        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Plus Populaire
          </span>
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          {price !== 'Sur Devis' && <span className="text-muted-foreground">/mois</span>}
        </div>

        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full font-semibold mt-auto ${isPopular
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
            : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
            }`}
          asChild
        >
          <Link href="/register">{cta}</Link>
        </Button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-24 md:py-32 lg:py-40 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsla(43, 96%, 56%, 0.15) 0%, transparent 50%)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background/50" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              La Gestion des Loyers
              <span className="block text-primary">Simplifiée</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              {/* <strong>Hofeti</strong> fournit aux propriétaires et gestionnaires l'automatisation des rappels de retard des loyers, surveiller les paiements et faciliter la relation locataire proprietaire. */}
              <strong>Hofeti</strong> Offre une automatisation des rappels de retard de loyer, suivis des paiements et facilite la relation entre le propriétaire et le locataire.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group"
                asChild
              >
                <Link href="/register">
                  Démarrer maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="#how">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='how' className="py-24 md:py-32 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Comment ça marche
              <span className="text-primary"> ?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Lancez votre gestion des loyers en quelques minutes seulement.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Ligne de connexion (visible sur desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Créez votre compte</h3>
                <p className="text-muted-foreground text-sm">
                  Inscription en quelques clics. Nom, Email, Téléphone.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ajoutez locataire</h3>
                <p className="text-muted-foreground text-sm">
                  Envoyez une invitation à vos locataires pour qu'ils accèdent à leur portail personnel.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ajoutez vos contrats</h3>
                <p className="text-muted-foreground text-sm">
                  Enregistrez vos contrats et configurez les informations de bail (loyer, charges, échéance).
                </p>
              </div>

              {/* Step 4 */}
              {/* <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Laissez faire l'automatisme</h3>
                <p className="text-muted-foreground text-sm">
                  Profitez de l'automatisation des quittances et des rappels de paiement. Rapports financiers clairs. Laissez faire l'automatisme.
                </p>
              </div> */}

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalités" className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tout pour la Gestion
              <span className="text-primary"> de vos Loyers</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une suite complète pour digitaliser votre activité locative et sécuriser vos revenus.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Receipt}
              title="Facturation Automatisée"
              description="Générez et envoyez les quittances de loyer automatiquement chaque mois. Fini les oublis et la paperasse."
              delay={0}
            />
            <FeatureCard
              icon={Wallet}
              title="Suivi des Paiements"
              description="Visualisez en temps réel les loyers payés et en retard. Enregistrez les règlements en quelques secondes."
              delay={100}
            />
            <FeatureCard
              icon={Smartphone}
              title="Relances SMS & Email"
              description="Réduisez les impayés grâce à des rappels automatiques envoyés aux locataires en cas de dépassement de la date d'échéance."
              delay={200}
            />
            <FeatureCard
              icon={Users}
              title="Portail Locataire"
              description="Offrez à vos locataires un espace personnel pour consulter leurs paiements, contrats et quittances 24h/24."
              delay={300}
            />
            <FeatureCard
              icon={FileText}
              title="Contrats & Baux"
              description="Gérez vos contrats de location, leurs renouvellements et conservez toutes vos pièces justificatives au même endroit."
              delay={400}
            />
            <FeatureCard
              icon={BarChart3}
              title="Rapports Financiers"
              description="Suivez la rentabilité de vos biens. Exportez vos états de revenus."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="tarifs" className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Des tarifs adaptés à
              <span className="text-primary"> Votre Réalité</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Évoluez selon vos besoins. Prix transparents pas de frais cacher.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            <PricingCard
              name="Basique"
              price="3 000 F CFA"
              description="Pour les propriétaires indépendants"
              features={[
                'Jusqu\'à 2 contrats',
                '2 utilisateurs',
                'Espace locataire inclus',
                'Support par email',
              ]}
              cta="Choisir ce plan"
              delay={0}
            />
            <PricingCard
              name="Standard"
              price="5 000 F CFA"
              description="Pour les agences et gestionnaires"
              isPopular
              features={[
                'Jusqu\'à 10 contrats',
                '10 utilisateurs',
                'Facturation & Relances AUTO',
                'Multi-utilisateurs',
                'Rapports financiers détaillés',
                'Support prioritaire',
              ]}
              cta="Choisir ce plan"
              delay={100}
            />
            <PricingCard
              name="Pro"
              price="10 000"
              description="Pour les grands portefeuilles"
              features={[
                'Jusqu\'à 25 contrats',
                '25 utilisateurs',
                'Facturation & Relances AUTO',
                'Multi-utilisateurs',
                'Rapports financiers détaillés',
                'Support prioritaire',
                'Marque blanche',
                'Account Manager dédié',
              ]}
              cta="Choisir ce plan"
              delay={200}
            />
          </div>
          <p className="text-center text-muted-foreground text-sm mt-12">
            * Tous les plans incluent un essai gratuit de 14 jours. Aucune carte bancaire requise pour commencer.
          </p>
        </div>
      </section> */}

      {/* Pricing Section */}
      <section id="tarifs" className="py-24 md:py-32 bg-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Des tarifs adaptés à
              <span className="text-primary"> Votre Réalité</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Évoluez selon vos besoins. Prix transparents, sans frais cachés.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">

            {/* Plan 1: Basique */}
            <PricingCard
              name="Basique"
              price="3 000 F"
              description="Pour les propriétaires indépendants"
              features={[
                { text: "2 contrats de location", included: true },
                { text: "2 utilisateurs", included: true },
                // { text: "Facturation manuelle", included: true },
                { text: "Espace locataire", included: true },
                { text: "Support par email", included: true },
                { text: "Facturation automatique", included: true },
                { text: "Relances automatiques", included: true },
                { text: "Rapports financiers", included: true },
                // { text: "Marque blanche", included: false },
              ]}
              cta="Commencer"
              delay={0}
            />

            {/* Plan 2: Standard */}
            <PricingCard
              name="Standard"
              price="5 000 F"
              description="Pour les agences en croissance"
              isPopular
              features={[
                { text: "10 contrats de location", included: true },
                { text: "10 utilisateurs", included: true },
                // { text: "Facturation manuelle", included: true },
                { text: "Espace locataire", included: true },
                { text: "Support prioritaire", included: true },
                { text: "Facturation automatique", included: true },
                { text: "Relances automatiques", included: true },
                { text: "Rapports financiers", included: true },
                // { text: "Marque blanche", included: false },
              ]}
              cta="Choisir ce plan"
              delay={100}
            />

            {/* Plan 3: Pro */}
            <PricingCard
              name="Pro"
              price="10 000 F"
              description="Pour les portefeuilles établis"
              features={[
                { text: "25 contrats de location", included: true },
                { text: "25 utilisateurs", included: true },
                // { text: "Facturation manuelle", included: true },
                { text: "Espace locataire", included: true },
                { text: "Support prioritaire", included: true },
                { text: "Facturation automatique", included: true },
                { text: "Relances automatiques", included: true },
                { text: "Rapports financiers", included: true },
                // { text: "Marque blanche", included: true },
              ]}
              cta="Choisir ce plan"
              delay={200}
            />

            {/* Plan 4: Premium */}
            {/* <PricingCard
              name="Premium"
              price="Sur Devis"
              description="Solutions sur mesure"
              features={[
                { text: "Contrats illimités", included: true },
                { text: "Utilisateurs illimités", included: true },
                { text: "Toutes les fonctionnalités Pro", included: true },
                { text: "API & Intégrations", included: true },
                { text: "Account Manager dédié", included: true },
                { text: "Formation sur site", included: true },
                { text: "SLA Garanti", included: true },
                { text: "Développements spécifiques", included: true },
                { text: "Support 24/7", included: true },
              ]}
              cta="Contacter"
              delay={300}
            /> */}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-12">
            * Tous les plans incluent un essai gratuit de 14 jours. Aucun paiement requise pour commencer.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="tarifs" className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Une formule complète,
              <span className="text-primary"> adaptée à votre engagement</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Accédez à toutes les fonctionnalités Hofeti sans limite. Plus vous vous engagez, plus vous économisez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">

            1. Plan Gratuit (Starter)
            <div className="relative rounded-2xl transition-all duration-500 bg-card border border-border hover:border-border flex flex-col">
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-foreground mb-2">Découverte</h3>
                <p className="text-muted-foreground text-sm mb-6">Pour tester la plateforme</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">0 F</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">5 contrats de location</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Facturation manuelle</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Support par email</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full font-semibold" asChild>
                  <Link href="/register">Commencer</Link>
                </Button>
              </div>
            </div>

            1. Pro Mensuel
            <div className="relative rounded-2xl transition-all duration-500 bg-card border border-border hover:border-border flex flex-col">
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-foreground mb-2">Mensuel</h3>
                <p className="text-muted-foreground text-sm mb-6">Flexible, sans engagement</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">5 900 F</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">3 contrats de location</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">3 Utilisateurs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Support par email</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full font-semibold" asChild>
                  <Link href="/register">Commencer</Link>
                </Button>
              </div>
            </div>

            2. Pro Trimestriel
            <div className="relative rounded-2xl transition-all duration-500 bg-card border border-border hover:border-border flex flex-col">
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-foreground mb-2">Trimestriel</h3>
                <p className="text-muted-foreground text-sm mb-6">Flexible, sans engagement</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">29 000 F</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm"><strong>Tout illimité</strong></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Facturation & Relances AUTO</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Rapports Financiers</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full font-semibold" asChild>
                  <Link href="/register">Choisir</Link>
                </Button>
              </div>
            </div>

            3. Pro Semestriel (Populaire)
            <div className="relative rounded-2xl transition-all duration-500 bg-gradient-to-b from-primary/10 to-card border-2 border-primary/50 scale-105 z-10 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Populaire
                </span>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Pro Semestriel</h3>
                    <p className="text-muted-foreground text-sm">Engagement 6 mois</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">-14%</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">25 000 F</span>
                  <span className="text-muted-foreground">/mois</span>
                  <p className="text-sm text-muted-foreground mt-1">Soit 150 000 F payés d'avance</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm"><strong>Tout illimité</strong></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Économie de 24 000 F</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Support Prioritaire</span>
                  </li>
                </ul>
                <Button className="w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg" asChild>
                  <Link href="/register">Choisir</Link>
                </Button>
              </div>
            </div>

            4. Pro Annuel
            <div className="relative rounded-2xl transition-all duration-500 bg-card border border-border hover:border-border flex flex-col">
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Pro Annuel</h3>
                    <p className="text-muted-foreground text-sm">Engagement 12 mois</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">-34%</span>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">19 000 F</span>
                  <span className="text-muted-foreground">/mois</span>
                  <p className="text-sm text-muted-foreground mt-1">Soit 228 000 F payés d'avance</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm"><strong>Tout illimité</strong></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Économie de 120 000 F</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">Account Manager dédié</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full font-semibold" asChild>
                  <Link href="/register">Choisir</Link>
                </Button>
              </div>
            </div>

          </div>

          <p className="text-center text-muted-foreground text-sm mt-12">
            * Les plans Pro incluent un essai gratuit de 14 jours. Aucune carte bancaire requise pour commencer.
          </p>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Prêt à Digitaliser
              <span className="text-primary"> Vos Loyers ?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Rejoignez les propriétaires et gestionnaires qui font confiance à Hofeti pour sécuriser leurs revenus locatifs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/20 group"
                asChild
              >
                <Link href="/register">
                  Créer mon compte maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            {/* <p className="text-muted-foreground text-sm mt-6">
              Aucune carte bancaire requise • 
            </p> */}
          </div>
        </div>
      </section>
    </>
  );
}