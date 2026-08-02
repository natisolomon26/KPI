import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Resource from "@/components/landing/Resource";
import CTA from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import Layout from "@/components/books/Layout";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Layout/>
    </main>
  );
}