import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl mb-8 text-center">Privacy Policy</h1>
          <p className="text-muted-foreground text-center mb-16">Last updated: February 2026</p>

          <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="font-display text-xl text-foreground mb-3">1. Information We Collect</h2>
              <p>We collect personal information you provide when creating an account, making a purchase, or contacting us. This includes your name, email address, phone number, shipping address, and payment information. We also collect usage data such as browsing behaviour, device information, and IP address through cookies and similar technologies.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">2. How We Use Your Information</h2>
              <p>We use your information to process orders, manage your account, provide customer support, send order updates, personalise your shopping experience, and improve our services. With your consent, we may send promotional communications about new collections, sales, and events.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">3. Information Sharing</h2>
              <p>We do not sell your personal information. We share data only with trusted service providers who assist in order fulfilment, payment processing, and delivery. These parties are contractually obligated to protect your information and use it only for the services we engage them to perform.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. Payment data is processed through PCI-DSS compliant payment processors and is never stored on our servers.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">5. Cookies</h2>
              <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and personalise content. You can manage cookie preferences through your browser settings. Essential cookies required for site functionality cannot be disabled.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly. To exercise any of these rights, please email us at privacy@theridmaluxury.com.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">7. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order data is retained for a minimum of 5 years for tax and regulatory compliance.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground mb-3">8. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at privacy@theridmaluxury.com or write to: The Ridma Luxury, Mumbai, Maharashtra 400001, India.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
