import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSideMenu from "@/components/CartSideMenu";
import FloatingCart from "@/components/FloatingCart";
import { OrderProvider } from "@/contexts/OrderContext";

// Lazy load de componentes below-the-fold para reducir bundle inicial
const OrderCalculator = lazy(() => import("@/components/OrderCalculator").then(m => ({ default: m.OrderCalculator })));
const RestaurantsSection = lazy(() => import("@/components/RestaurantsSection"));
const DistributorsSection = lazy(() => import("@/components/DistributorsSection"));
const B2BSection = lazy(() => import("@/components/B2BSection"));

/** Skeleton de carga para secciones lazy */
const SectionSkeleton = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-foreground border-t-primary animate-spin" />
      <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">Cargando...</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <>
      <SEOHead />
      <OrderProvider>
        <div className="min-h-screen bg-background bg-paper-texture">
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <Header />
          <main id="main-content">
            <HeroSection />
            <section id="productos" className="py-24 relative overflow-hidden bg-muted/30 bg-paper-texture">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6"
                  >
                    ARMA TU PEDIDO DE <span className="inline-block bg-foreground text-background px-2">TOFU</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-body text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto"
                  >
                    Arma tu pedido en minutos. Si tienes negocio,
                    <a href="#mayoristas" className="underline ml-1">consulta precios especiales</a>.
                  </motion.p>
                </div>

                <div className="max-w-5xl mx-auto">
                  <ProductsSection variant="embedded" />
                </div>
              </div>
            </section>
            <Suspense fallback={<SectionSkeleton />}>
              <RestaurantsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <DistributorsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <B2BSection />
            </Suspense>
          </main>
          <Footer />
          <CartSideMenu />
          <FloatingCart />
        </div>
      </OrderProvider>
    </>
  );
};

export default Index;
