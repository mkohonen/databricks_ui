import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HarjoitusYhteenveto } from "@/components/ui/HarjoitusYhteenveto"; // Tuodaan uusi komponentti
import { fetchHarjoitusYhteenveto } from "../lib/api";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function SportsDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const valittuHarjoitusId = params.id;

  // Jos käyttäjä ei ole valinnut mitään harjoitusta listasta, näytetään ohje
  if (!valittuHarjoitusId) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400 text-sm italic p-6">
        👈 Valitse harjoitus vasemman laidan listasta nähdäksesi Databricks-yhteenvedon.
      </div>
    );
  }

  // Haetaan oikea data Spring Boot API:sta dynaamisella ID-arvolla
  const yhteenveto = await fetchHarjoitusYhteenveto(valittuHarjoitusId);

  // Jos harjoitusta ei löydy taustajärjestelmästä
  if (!yhteenveto) {
    return (
      <div className="h-full flex items-center justify-center text-red-500 text-sm font-medium p-6">
        ❌ Harjoituksen ({valittuHarjoitusId}) yhteenvetodataa ei löytynyt API-rajapinnasta.
      </div>
    );
  }

  return (
    <>
      {/* Otsikko muuttuu dynaamisesti valinnan mukaan */}
      <h3 className="text-xl font-bold tracking-tight text-zinc-800">
        Yhteenveto: {yhteenveto.harjoitusId}
      </h3>

      {/* KÄYTETÄÄN UUTTA KOMPONENTTIA: Välitetään haettu data propeissa */}
      <HarjoitusYhteenveto data={yhteenveto} />

      {/* Kuvaajapaikka 1: Donut */}
      <Card className="bg-white border-zinc-200 shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-medium text-zinc-700">Sykealueiden ajallinen jakauma (/zones)</CardTitle>
        </CardHeader>
        <CardContent className="h-44 flex items-center justify-center border-t border-zinc-100 text-xs text-zinc-400 bg-zinc-50 font-mono">
          [ Ympyrädiagrammi / Donut Chart ]
        </CardContent>
      </Card>

      {/* Kuvaajapaikka 2: Line */}
      <Card className="bg-white border-zinc-200 shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-medium text-zinc-700">Kiihtyvyys ja g-voimat aikajärjestyksessä (/intensiteetti)</CardTitle>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center border-t border-zinc-100 text-xs text-zinc-400 bg-zinc-50 font-mono">
          [ Viivadiagrammi / Line Chart ]
        </CardContent>
      </Card>
    </>
  )
}
