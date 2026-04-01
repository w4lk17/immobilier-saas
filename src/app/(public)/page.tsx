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
  Star,
  Quote,
  Zap,
  Building2,
  Clock
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

// Testimonial Card
function TestimonialCard({ quote, author, role, company, delay = 0 }: {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative bg-card border border-border rounded-2xl p-8 hover:border-primary/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Quote className="h-8 w-8 text-primary/30 mb-4" />
      <p className="text-foreground leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold">
          {author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
}

// Pricing Card
function PricingCard({ name, price, description, features, isPopular, cta, delay = 0 }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl transition-all duration-500 ${isPopular
          ? 'bg-gradient-to-b from-primary/10 to-card border-2 border-primary/50 scale-105 z-10'
          : 'bg-card border border-border hover:border-border'
        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
            Plus Populaire
          </span>
        </div>
      )}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          {price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`w-full font-semibold ${isPopular
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

// Stats Counter Component
function StatItem({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
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

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-secondary/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Plus de 5 000 gestionnaires immobiliers nous font confiance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Simplifiez la Gestion
              <span className="block text-primary">Immobilière</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              La plateforme tout-en-un qui aide les gestionnaires immobiliers et propriétaires à automatiser la collecte des loyers,
              suivre les maintenances et améliorer la satisfaction des locataires.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group"
                asChild
              >
                <Link href="/register">
                  Commencer l'Essai Gratuit
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="#pricing">Voir les Tarifs</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Conforme SOC 2</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Support 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Aucune carte bancaire requise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={5000} label="Biens Gérés" suffix="+" />
            <StatItem value={2} label="Millions de Loyer Collecté" suffix="M+" />
            <StatItem value={98} label="Satisfaction Client" suffix="%" />
            <StatItem value={50} label="Temps Économisé" suffix="%" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalités" className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tout Dont Vous Avez Besoin Pour
              <span className="text-primary"> Réussir</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Des outils puissants conçus spécifiquement pour les gestionnaires immobiliers, propriétaires et investisseurs immobiliers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Receipt}
              title="Facturation Automatisée"
              description="Envoyez des rappels de loyer et des factures automatiquement. Acceptez les paiements en ligne et réduisez les retards de paiement jusqu'à 70%."
              delay={0}
            />
            <FeatureCard
              icon={Building2}
              title="Suivi des Vacances"
              description="Surveillez l'occupation des biens en temps réel. Recevez des alertes lorsque les baux expirent et réduisez les taux de vacance."
              delay={100}
            />
            <FeatureCard
              icon={Users}
              title="Portail Locataire"
              description="Offrez aux locataires un accès 24/7 pour payer le loyer, soumettre des demandes de maintenance et consulter les documents de bail."
              delay={200}
            />
            <FeatureCard
              icon={FileText}
              title="Gestion des Contrats"
              description="Stockez et gérez tous les baux numériquement. Signatures électroniques incluses pour un intégration plus rapide."
              delay={300}
            />
            <FeatureCard
              icon={Wrench}
              title="Demandes de Maintenance"
              description="Simplifiez les flux de travail de maintenance. Les locataires soumettent des demandes, vous assignez des prestataires, tout le monde reste informé."
              delay={400}
            />
            <FeatureCard
              icon={BarChart3}
              title="Rapports Financiers"
              description="Générez des rapports détaillés sur les revenus, dépenses et performances des biens. Exportez pour la saison fiscale."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="témoignages" className="py-24 md:py-32 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Approuvé par les Gestionnaires
              <span className="text-primary"> Immobiliers</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels de l'immobilier qui ont transformé leurs opérations avec EstateFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="EstateFlow a réduit mon travail administratif de 60%. Je passais mes week-ends à poursuivre les paiements de loyer. Maintenant, tout fonctionne en pilote automatique."
              author="Sarah Mitchell"
              role="Gestionnaire Immobilière"
              company="Horizon Properties"
              delay={0}
            />
            <TestimonialCard
              quote="Le portail locataire à lui seul vaut l'abonnement. Mes locataires adorent pouvoir payer leur loyer et soumettre des demandes de maintenance en ligne."
              author="Marcus Johnson"
              role="Propriétaire"
              company="Portefeuille de 12 Unités"
              delay={100}
            />
            <TestimonialCard
              quote="Enfin, un outil de gestion immobilière qui comprend les investisseurs immobiliers. Les rapports financiers m'aident à prendre de meilleures décisions d'acquisition."
              author="Elena Rodriguez"
              role="Investisseuse Immobilière"
              company="Rodriguez Holdings"
              delay={200}
            />
          </div>

          {/* Rating Summary */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-foreground font-semibold">4,9/5</span>
              <span className="text-muted-foreground">sur Capterra</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-foreground font-semibold">4,8/5</span>
              <span className="text-muted-foreground">sur G2</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Des Tarifs Simples et
              <span className="text-primary"> Transparents</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Commencez gratuitement, évoluez selon vos besoins. Aucuns frais cachés, aucun engagement à long terme.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            <PricingCard
              name="Gratuit"
              price="0 F CFA"
              description="Parfait pour les propriétaires qui débutent"
              features={[
                'Jusqu\'à 5 unités',
                'Accès au portail locataire',
                'Suivi de base des maintenances',
                'Support par email',
                'Accès à la communauté'
              ]}
              cta="Commencer"
              delay={0}
            />
            <PricingCard
              name="Pro"
              price="49 000 F CFA"
              description="Pour les gestionnaires immobiliers en croissance"
              isPopular
              features={[
                'Jusqu\'à 50 unités',
                'Collecte automatique des loyers',
                'Gestion des contrats',
                'Rapports financiers',
                'Support prioritaire par email et chat',
                'Accès API'
              ]}
              cta="Essai Gratuit"
              delay={100}
            />
            <PricingCard
              name="Entreprise"
              price="Sur Mesure"
              description="Pour les grands portefeuilles et équipes"
              features={[
                'Unités illimitées',
                'Portail locataire en marque blanche',
                'Intégrations personnalisées',
                'Gestionnaire de compte dédié',
                'Garantie SLA',
                'Formation sur site'
              ]}
              cta="Contacter les Ventes"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Prêt à Transformer Votre
              <span className="text-primary"> Gestion Immobilière ?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Rejoignez plus de 5 000 professionnels de l'immobilier qui ont déjà rationalisé leurs opérations.
              Commencez votre essai gratuit de 14 jours aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-xl shadow-primary/20 group"
                asChild
              >
                <Link href="/register">
                  Essai Gratuit
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="/demo">Réserver une Démo</Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-6">
              Aucune carte bancaire requise. Essai gratuit de 14 jours. Annulez à tout moment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}