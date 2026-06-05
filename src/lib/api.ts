import { components } from "@/types/api";

// Poimitaan tyypit suoraan generoidun tiedostosi schemas-osiosta
type HarjoitusYhteenveto = components["schemas"]["HarjoitusYhteenveto"];
type HarjoitusPerustieto = components["schemas"]["HarjoitusPerustieto"];

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Hakee yksittäisen harjoituksen Databricks-yhteenvedon
 */
export async function fetchHarjoitusYhteenveto(harjoitusId: string): Promise<HarjoitusYhteenveto | null> {
  try {
    const res = await fetch(`${SPRING_BOOT_URL}/harjoitus/${harjoitusId}/yhteenveto`, {
      next: { revalidate: 10 }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Virhe yhteenvetoa haettaessa:", error);
    return null;
  }
}

/**
 * Hakee listan kaikista harjoituksista vasemman laidan sivupalkkiin
 */
export async function fetchKaikkiHarjoitukset(): Promise<HarjoitusPerustieto[]> {
  try {
    const res = await fetch(`${SPRING_BOOT_URL}/harjoitus`, {
      next: { revalidate: 10 }
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Virhe harjoituslistaa haettaessa:", error);
    return [];
  }
}
