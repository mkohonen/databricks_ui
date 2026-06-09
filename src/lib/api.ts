import { components } from "@/types/api";

type HarjoitusYhteenveto = components["schemas"]["HarjoitusYhteenveto"];
type HarjoitusPerustieto = components["schemas"]["HarjoitusPerustieto"];

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// Haetaan API-avain ympäristömuuttujista
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "oletus_avain_jos_ei_asetettu";
const AUTH_METHOD = process.env.NEXT_PUBLIC_AUTH_METHOD || "api-key";

/**
 * Apufunktio, joka luo oikeat otsikot valitun menetelmän mukaan
 */
function getAuthHeaders(oauthToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (AUTH_METHOD === "api-key" && API_KEY) {
    headers["X-API-Key"] = API_KEY;
  } else if (AUTH_METHOD === "oauth2" && oauthToken) {
    headers["Authorization"] = `Bearer ${oauthToken}`;
  }

  return headers;
}


/**
 * Hakee yksittäisen harjoituksen Databricks-yhteenvedon
 */
export async function fetchHarjoitusYhteenveto(harjoitusId: string, oauthToken?: string): Promise<HarjoitusYhteenveto | null> {
  try {
    const res = await fetch(`${SPRING_BOOT_URL}/harjoitus/${harjoitusId}/yhteenveto`, {
      headers: getAuthHeaders(oauthToken),
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

export async function fetchKaikkiHarjoitukset(oauthToken?: string): Promise<HarjoitusPerustieto[]> {
  try {
    const res = await fetch(`${SPRING_BOOT_URL}/harjoitus`, {
      // Haetaan otsikot dynaamisesti apufunktiosta
      headers: getAuthHeaders(oauthToken),
      next: { revalidate: 10 }
    });
     // Lisätään lokitus, jotta nähdään mitä palvelin vastaa
    console.log("fetchKaikkiHarjoitukset status:", res.status);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Virhe harjoituslistaa haettaessa:", error);
    return [];
  }
}

