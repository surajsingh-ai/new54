import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import brandBag from "@/assets/brand-handbags.jpg";
import productsShowcase from "@/assets/products-showcase.jpg";

const collections = [
  {
    title: "Handbags",
    subtitle: "Essential Elegance",
    description: "Timeless designs crafted for the modern woman",
    image: brandBag,
    href: "/handbags",
    accent: "from-primary/80 to-accent/80",
  },
  {
    title: "Accessories",
    subtitle: "Refined Details",
    description: "Perfect complements to complete your look",
    image: productsShowcase,
    href: "/accessories",
    accent: "from-accent/80 to-cognac/80",
  },
  {
    title: "New Arrivals",
    subtitle: "Latest Designs",
    description: "Fresh from our Italian workshops",
    image: brandBag,
    href: "/collections",
    accent: "from-cognac/80 to-primary/80",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/50 to-background" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
              Our Collections
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            Curated <span className="italic text-primary">Excellence</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Each piece represents the pinnacle of Italian leather craftsmanship, 
            designed to accompany you through life's every moment.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={collection.title}
              to={collection.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.accent} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">
                    {collection.subtitle}
                  </p>
                  <h3 className="font-display text-2xl lg:text-3xl text-white mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-4">
                    {collection.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="text-sm tracking-wider uppercase">Explore</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
