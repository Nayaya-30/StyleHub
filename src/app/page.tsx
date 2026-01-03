// ============================================
// FILE: src/app/page.tsx
// ============================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scissors,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const features = [
    {
      icon: Scissors,
      title: "Professional Management",
      description: "Complete tailoring business management from orders to delivery",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly coordinate between managers, workers, and customers",
    },
    {
      icon: TrendingUp,
      title: "Business Analytics",
      description: "Track performance, revenue, and growth with detailed insights",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Integrated Flutterwave payments for African markets",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live order tracking and instant notifications",
    },
    {
      icon: Globe,
      title: "Multi-Organization",
      description: "Showcase designs across multiple tailoring houses",
    },
  ];

  const stats = [
    { value: "500+", label: "Active Tailors" },
    { value: "10K+", label: "Happy Customers" },
    { value: "50K+", label: "Orders Completed" },
    { value: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background py-20 md:py-32">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              Professional Tailoring Platform
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Connecting Africa's{" "}
              <span className="text-gradient-primary">Best Tailors</span> with
              Customers
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Streamline your tailoring business with our comprehensive management
              platform. From showcasing designs to managing orders and teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/styles">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Styles
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-coral-200/20 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed specifically for African tailoring businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover-scale">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">
              Simple & Powerful Workflow
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes and manage everything in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Your Showcase",
                description: "Upload your designs and set up your organization profile",
              },
              {
                step: "02",
                title: "Receive Orders",
                description: "Customers browse and place orders with measurements",
              },
              {
                step: "03",
                title: "Manage & Deliver",
                description: "Assign tasks, track progress, and deliver with ease",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute -right-12 top-8 h-8 w-8 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">
              Loved by Tailors Across Africa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Adebayo Okafor",
                role: "Fashion House Owner, Lagos",
                content: "StyleHub transformed how we manage orders. We've increased our capacity by 3x!",
                rating: 5,
              },
              {
                name: "Amina Hassan",
                role: "Boutique Manager, Accra",
                content: "The team collaboration features are incredible. Our workers love the task management.",
                rating: 5,
              },
              {
                name: "Kwame Mensah",
                role: "Master Tailor, Nairobi",
                content: "Finally, a platform built for African tailors. The payment integration works perfectly.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20">
        <div className="container-custom relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Join thousands of tailors already using StyleHub to grow their business
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}