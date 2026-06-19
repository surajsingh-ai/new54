import { Button } from "./ui/button";
import { ArrowRight, Award, Leaf, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import brandBag from "@/assets/brand-handbags.jpg";

const features = [
  {
    icon: Award,
    title: "100%",
    subtitle: "Italian Leather",
    description: "Sourced from historic tanneries",
  },
  {
    icon: Heart,
    title: "50+",
    subtitle: "Master Artisans",
    description: "Generations of expertise",
  },
  {
    icon: Leaf,
    title: "Eco",
    subtitle: "Sustainable",
    description: "Ethical craftsmanship",
  },
];

const BrandStory = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-secondary/50" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src={brandBag}
                alt="Kaylaitalia artisan craftsmanship"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 lg:right-8 bg-background/95 backdrop-blur-sm p-6 rounded-xl shadow-elegant border border-border/50 animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display text-2xl text-primary">Since 2018</p>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">Crafting Excellence</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-primary/20 rounded-2xl hidden lg:block" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full hidden lg:block" />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Our Heritage
              </span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
              A Legacy of
              <br />
              <span className="italic bg-gradient-to-r from-primary via-gold-light to-accent bg-clip-text text-transparent">
                Craftsmanship
              </span>
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                Born from a passion for timeless elegance, Kaylaitalia represents the pinnacle 
                of Italian leather artistry. Each piece is meticulously handcrafted by master 
                artisans who have perfected their craft over generations.
              </p>
              <p>
                We source only the finest full-grain leather from historic Italian tanneries, 
                ensuring every bag, wallet, and accessory embodies the rich tradition of 
                Italian craftsmanship while embracing contemporary design.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="group p-4 rounded-xl bg-secondary/50 hover:bg-primary/10 transition-all duration-300 cursor-default animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <feature.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-display text-2xl text-foreground">{feature.title}</p>
                  <p className="text-xs tracking-widest uppercase text-primary mt-1">{feature.subtitle}</p>
                </div>
              ))}
            </div>

            <Link to="/about" className="inline-block mt-10">
              <Button variant="luxury" size="lg" className="group">
                Discover Our Story
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
