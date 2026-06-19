import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminAddProductFab from "@/components/AdminAddProductFab";
import MarketplaceHome from "@/components/MarketplaceHome";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <MarketplaceHome />
      <Footer />
      <AdminAddProductFab />
    </div>
  );
};

export default Index;
