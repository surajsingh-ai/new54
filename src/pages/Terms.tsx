import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl mb-8 text-center">Terms of Service</h1>
          <p className="text-muted-foreground text-center mb-16">Last updated: February 2026</p>

          <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="font-display text-xl text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using The Ridma Luxury website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time, and continued use constitutes acceptance of any changes.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">2. Products and Pricing</h2>
              <p>All product descriptions, images, and prices are provided for informational purposes and are subject to change without notice. We make every effort to display colours and details accurately, but we cannot guarantee that your display accurately reflects the actual product. Prices are listed in Indian Rupees (₹) and include applicable taxes unless otherwise stated.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">3. Orders and Payment</h2>
              <p>By placing an order, you confirm that all information provided is accurate and complete. We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraud. Payment must be received in full before order processing begins.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">4. Shipping and Delivery</h2>
              <p>We aim to process and ship orders within 2-3 business days. Delivery times are estimates and may vary based on location and carrier availability. Risk of loss and title for items pass to you upon delivery. We are not responsible for delays caused by carriers or customs processing.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">5. Returns and Refunds</h2>
              <p>Products may be returned within 14 days of delivery in their original, unused condition with all tags and packaging intact. Refunds will be processed to the original payment method within 7-10 business days of receiving the returned item. Shipping costs for returns are borne by the customer unless the return is due to a defect or error on our part.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">6. Intellectual Property</h2>
              <p>All content on this website, including text, graphics, logos, images, and software, is the property of The Ridma Luxury and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">7. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">8. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, The Ridma Luxury shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or products. Our total liability shall not exceed the amount you paid for the product or service giving rise to the claim.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">9. Governing Law</h2>
              <p>These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">10. Contact</h2>
              <p>For questions about these Terms of Service, please contact us at legal@theridmaluxury.com or write to: The Ridma Luxury, Mumbai, Maharashtra 400001, India.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
