import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graphly - Learn Graph Algorithms - Read, Visualize and Solve",
  description:
    "Graphly is your ultimate destination for mastering graph algorithms. Dive into comprehensive articles, interactive visualizations, and engaging problem sets that make learning graph theory intuitive and enjoyable. Whether you're a student, educator, or enthusiast, Graphly offers a dynamic platform to explore the fascinating world of graphs and algorithms.",
};

export const viewport: Viewport = {
  width: "1024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer theme="dark" limit={3} />
        {children}
      </body>
    </html>
  );
}
