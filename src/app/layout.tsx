import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloating from "@/components/WhatsAppFloating";

export const metadata: Metadata = {
  title: "Trifting Official | Curated Streetwear & Vintage Grails",
  description: "Toko online pakaian thrift streetwear modern, stylish, dan premium. Kurasi jacket vintage, single stitch tees, hoodies, dan denim 1-of-1.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#111111] antialiased">
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
                <WhatsAppFloating />
              </WishlistProvider>
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
