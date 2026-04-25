import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://luminablog-two.vercel.app"),
  title: "LuminaBlogs - Ideas & Insights",
  description:
    "LuminaBlogs is a modern platform for sharing thoughts and articles on Tech, Design, and Life.",
  openGraph: {
    title: "LuminaBlogs - Ideas & Insights",
    description:
      "Explore real experiences and insights on Tech, Design, and Life at Lumina Blog.",
    url: "https://luminablog-two.vercel.app/admin",
    siteName: "LuminaBlogs",
    images: [
      {
        url: "/blog.jpg",
        width: 1200,
        height: 630,
        alt: "Lumina Blog Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuminaBlogs - Ideas & Insights",
    description:
      "Explore real experiences and insights on Tech, Design, and Life at Lumina Blog.",
    images: ["/blog.jpg"],
  },
  icons: {
    icon: "/blogging-writer-svgrepo-com.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-[#FAFAFA] text-slate-900 font-inter antialiased selection:bg-indigo-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-slate-200 py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-outfit font-black tracking-tighter text-indigo-600">
                  LUMINA.
                </span>
                <p className="text-sm text-slate-400 max-w-xs">
                  Connecting digital minds through high-quality narratives.
                </p>
              </div>
              <div className="flex space-x-10 text-sm font-semibold text-slate-500">
                <Link
                  href="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Archive
                </Link>
                <Link
                  href="/login"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Access
                </Link>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-indigo-600 transition-colors">
                  Privacy
                </a>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                © 2026 Lumina Platform.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
