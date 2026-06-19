import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
}

const ProductCarousel = ({ products, title, viewAllLink, viewAllText = "View All" }: ProductCarouselProps) => {
  if (products.length === 0) return null;

  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        {viewAllLink && (
          <a 
            href={viewAllLink} 
            className="text-sm text-primary hover:underline underline-offset-4"
          >
            {viewAllText}
          </a>
        )}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full group"
      >
        <CarouselContent className="-ml-4">
          {products.map((product, index) => (
            <CarouselItem 
              key={product.id} 
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/90 border-border hover:bg-accent shadow-md" />
        <CarouselNext className="right-2 bg-background/90 border-border hover:bg-accent shadow-md" />
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
