import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CollectionCardProps {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  style?: React.CSSProperties;
  className?: string;
}

const CollectionCard = ({ title, subtitle, image, href, className = "", style }: CollectionCardProps) => {
  return (
    <a
      href={href}
      className={`group relative overflow-hidden block ${className}`}
      style={style}
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-xs tracking-widest uppercase text-background/70 mb-2">{subtitle}</p>
        <h3 className="font-display text-2xl text-background mb-4">{title}</h3>
        <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-background opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          Discover
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </a>
  );
};

export default CollectionCard;
