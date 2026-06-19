import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import brandBag from "@/assets/brand-handbags.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={brandBag}
          alt="Kaylaitalia luxury leather handbag"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        {/* Modern gradient overlays - darker, richer tones */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
      </div>

      {/* Animated accent orbs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-accent/15 rounded-full blur-[80px] animate-float-delayed" />

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
              Handcrafted in Italy
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-8 animate-fade-up stagger-2">
            <span className="block text-cream">Timeless</span>
            <span className="block italic bg-gradient-to-r from-primary via-gold-light to-primary bg-clip-text text-transparent">
              Elegance
            </span>
          </h2>

          <p className="text-lg md:text-xl text-cream/80 max-w-md mb-12 leading-relaxed animate-fade-up stagger-3">
            Discover our collection of exquisite leather goods, where Italian craftsmanship meets contemporary design.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up stagger-4">
            <Link to="/collections">
              <Button variant="luxury" size="xl" className="group relative overflow-hidden bg-charcoal hover:bg-charcoal/90 text-cream border-0">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="luxury-outline" size="xl" className="backdrop-blur-md border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/50">
                Our Story
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-cream/20 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="group cursor-default">
              <p className="font-display text-3xl md:text-4xl text-primary group-hover:scale-110 transition-transform">100%</p>
              <p className="text-xs tracking-widest uppercase text-cream/60 mt-1">Italian Leather</p>
            </div>
            <div className="group cursor-default">
              <p className="font-display text-3xl md:text-4xl text-primary group-hover:scale-110 transition-transform">50+</p>
              <p className="text-xs tracking-widest uppercase text-cream/60 mt-1">Master Artisans</p>
            </div>
            <div className="group cursor-default">
              <p className="font-display text-3xl md:text-4xl text-primary group-hover:scale-110 transition-transform">Est. 2018</p>
              <p className="text-xs tracking-widest uppercase text-cream/60 mt-1">Heritage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-xs tracking-widest uppercase text-cream/60">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
