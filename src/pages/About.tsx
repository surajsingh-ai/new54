import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import brandBag from "@/assets/brand-handbags.jpg";
import productsShowcase from "@/assets/products-showcase.jpg";

const About = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="container mx-auto px-6 lg:px-12 mb-24">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">About ShopVerse</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">Built for Everyday Shopping</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              ShopVerse brings popular products, useful deals, secure payments and reliable
              delivery into one easy multi-category marketplace.
            </p>
          </div>
          <div className="aspect-[21/9] overflow-hidden bg-card">
            <img src={brandBag} alt="Marketplace product showcase" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Heritage / Craftsmanship */}
        <section id="craftsmanship" className="container mx-auto px-6 lg:px-12 mb-24 scroll-mt-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Our Promise</p>
              <h2 className="font-display text-3xl md:text-4xl mb-6">Choice, Value and Convenience</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We organize products across mobiles, electronics, fashion, home, appliances,
                grocery, beauty, sports, books and more so customers can compare quickly
                and shop confidently.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The experience is designed around clear catalog browsing, helpful product
                information, cart and checkout flows, order tracking and customer support.
              </p>
            </div>
            <div className="aspect-square overflow-hidden bg-card">
              <img src={productsShowcase} alt="Assorted marketplace products" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Values / Sustainability */}
        <section id="sustainability" className="bg-secondary py-24 scroll-mt-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Our Values</p>
              <h2 className="font-display text-3xl md:text-4xl">What Defines Us</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Selection", description: "A wide range of products across everyday shopping categories." },
                { title: "Value", description: "Clear pricing, useful deals and category offers for practical buying." },
                { title: "Trust", description: "Secure checkout, order tracking and customer support built into the shopping flow." },
              ].map((value, index) => (
                <div
                  key={value.title}
                  className="text-center p-8 bg-background border border-border/50 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="font-display text-xl mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
