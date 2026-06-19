import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast({ title: "Message sent", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-5xl mb-6">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question about our products, shipping, or anything else, our team is ready to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl mb-6">Reach Out</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground text-sm">support@kaylaitalia.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground text-sm">123 Fashion Street, Mumbai, Maharashtra 400001, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl mb-4">Shipping & Returns</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We offer free shipping on orders above ₹2,999. Standard delivery takes 5-7 business days.
                  Returns are accepted within 14 days of delivery in original condition. Contact us to initiate a return.
                </p>
              </div>

              <div>
                <h3 className="font-display text-xl mb-4">Product Care</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Follow the care label or manual included with each product. Keep electronics dry, store grocery and
                  beauty items as directed, and clean fashion or home products with suitable materials.
                </p>
              </div>

              <div>
                <h3 className="font-display text-xl mb-4">FAQs</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">How long does delivery take?</p>
                    <p className="text-muted-foreground">Standard delivery takes 5-7 business days across India.</p>
                  </div>
                  <div>
                    <p className="font-medium">What is your return policy?</p>
                    <p className="text-muted-foreground">We accept returns within 14 days of delivery in original, unused condition.</p>
                  </div>
                  <div>
                    <p className="font-medium">Do you offer gift wrapping?</p>
                    <p className="text-muted-foreground">Yes, premium gift wrapping is available at checkout for ₹199.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary p-8 lg:p-12">
              <h2 className="font-display text-2xl mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Name</label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="rounded-none" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Email</label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="rounded-none" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Subject</label>
                  <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required className="rounded-none" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Message</label>
                  <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="rounded-none" />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
