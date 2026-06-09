import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WorkoutList } from "@/components/ui/WorkoutList";
import { DataIngestForm } from "@/components/ui/DataIngestForm";
import { fetchKaikkiHarjoitukset } from "@/lib/api"; // Tuodaan uusi API-funktio
import "./globals.css";
import { Suspense } from "react";
import OAuth2TestButton from "@/components/ui/OAuth2TestButton";

export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sports Data Platform",
  description: "POC-dashboard",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Haetaan lista suoraan palvelimella Spring Boot API:sta ennen sivun latausta!
  const harjoitukset = await fetchKaikkiHarjoitukset();

  return (
    <html lang="fi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-zinc-900`}>
        <div className="flex flex-col h-screen w-screen overflow-hidden">

          {/* TOP BAR */}
          <header className="h-10 bg-blue-600 flex items-center justify-between px-4 shrink-0 shadow-md z-10">
            <h1 className="text-sm font-bold tracking-wide uppercase text-white">
              🏃‍♂️ Sports Data Platform - Dashboard
            </h1>

            {/* 2. Lisätään testipainike yläpalkin oikeaan reunaan */}
            <OAuth2TestButton />
          </header>

          {/* INFO AREA */}
          <section className="bg-blue-50/70 border-b border-blue-100 p-6 flex flex-col md:flex-row justify-between items-start gap-4 shrink-0">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-lg font-bold text-blue-700">Sports Data Platform API — Järjestelmän tila ja ohjeet</h2>
              <p className="text-sm text-zinc-700">Tämä käyttöliittymä on kytketty OpenAPI v1.0.0 -määrityksen mukaiseen taustajärjestelmään.</p>
            </div>
            <div className="w-full md:w-52 bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex flex-col items-center justify-center text-center text-xs shadow-sm">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">API YHTEYSTILA</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> [ OK — Connected ]
              </span>
            </div>
          </section>

          {/* RUNKO */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            {/* Kääritään hakuparametreja käyttävä komponentti Suspenseen */}
            <Suspense fallback={<div>Ladataan sivupalkkia...</div>}>
              {/* Välitetään API:sta haettu lista komponentille */}
              <WorkoutList initialHarjoitukset={harjoitukset} />
            </Suspense>
            {/* KESKIALUE */}
            <main className="lg:col-span-6 bg-white p-6 space-y-6 overflow-y-auto">
              {children}
            </main>

            {/* OIKEA PANEELI */}
            <DataIngestForm />

          </div>

        </div>
      </body>
    </html>
  );
}
