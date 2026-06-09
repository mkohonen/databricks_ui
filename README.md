This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

markdown# Azure Databricks & Event Hub UI - POC

Tämä on moderni, full-stack React-käyttöliittymä (Proof of Concept), joka on suunniteltu Azure Event Hubin ja Azure Databricks (Spark/Scala) -streaming-arkkitehtuurin monitorointiin ja hallintaan. Sovellus kommunikoi erillisen Spring Boot API -taustajärjestelmän kanssa.

## 🚀 Teknologiapino (Modern UI Stack)

- **Kehys (Framework):** [Next.js 15+](https://nextjs.org) (App Router & React Server Components)
- **Kääntäjä:** [React Compiler](https://react.dev) (Automaattinen suorituskyvyn optimointi)
- **Kieli:** [TypeScript](https://typescriptlang.org) (Päästä päähän -tyyppiturvallisuus)
- **Tyylittely:** [Tailwind CSS](https://tailwindcss.com) (Utility-first CSS)
- **Design System & UI-komponentit:** [shadcn/ui](https://shadcn.com) (Radix UI Primitives, Nova-preset tiiviille datanäkymille)

---

## 📐 Arkkitehtuuri & Dataflow

[ Azure Databricks (Spark) ] ◄── (Hakee tapahtumat) ── [ Azure Event Hub ]▲│ (Lähettää)[ Spring Boot API ]▲│ (REST / SSE)[ Next.js Frontend ]


1. **Spring Boot API** toimii järjestelmän ytimenä, joka hallitsee dataa ja lähettää tapahtumia **Azure Event Hubiin**.
2. **Azure Databricks (Spark/Scala)** lukee viestit Event Hubista ja suorittaa streaming-analytiikan.
3. **Next.js UI** visualisoi järjestelmän tilan, jonot ja Spark-ajot kutsumalla Spring Boot API:a.

---

## 🛠️ OpenAPI & TypeScript-tyyppien generointi

Sovellus käyttää Spring Boot API:n tuottamaa **OpenAPI (Swagger)** -määrittelyä tyyppiturvallisuuden varmistamiseen. Käyttöliittymän TypeScript-tyyppejä **ei kirjoiteta käsin**, vaan ne generoidaan suoraan API-dokumentaatiosta.

### 1. Tyyppien generointi urlista tai tiedostosta

Kun Spring Boot API:n rajapinta muuttuu, päivitä frontentin tyypit ajamalla seuraava komento projektin juuressa:

```bash
# Jos API pyörii paikallisesti (korvaa portti tarvittaessa):
npx openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api.ts

# Tai jos käytät paikallista JSON/YAML-tiedostoa:
npx openapi-typescript path/to/your/openapi.json -o src/types/api.ts
```

### 2. Generoitujen tyyppien käyttö koodissa

Voit käyttää generoituja tyyppejä suoraan Next.js-komponenteissa ja datanhakufunktioissa:

```typescript
import { paths } from "@/types/api";

// Esimerkki: Haetaan tyyppi GET /api/v1/events -rajapinnan 200-vastaukselle
type EventListResponse = paths["/api/v1/events"]["get"]["responses"]["200"]["content"]["application/json"];
```

---

## 💻 Kehitysympäristön käynnistys

### Esivaatimukset
- Node.js 20 tai uudempi
- Käynnissä oleva Spring Boot API (suositeltu tyyppien generointia varten)

### 1. Asenna riippuvuudet
```bash
npm install
```

### 2. Käynnistä kehityspalvelin (Turbopack-tuella)
```bash
npm run dev
```

Avaa [http://localhost:3000](http://localhost:3000) selaimessa nähdäksesi sovelluksen.

---

## 📦 UI-komponenttien lisääminen

Käytämme `shadcn/ui` CLI-työkalua uusien komponenttien tuomiseen. Komponentit latautuvat suoraan kansioon `src/components/ui/`.

Esimerkki uuden komponentin (esim. dialogi/modal) lisäämisestä:
```bash
npx shadcn@latest add dialog
```

## Ympäristömuuttujat ja Tunnistautuminen

Sovellus osaa mukautua taustajärjestelmän (Spring Boot) vaatimaan tunnistautumistapaan dynaamisesti.

### Paikalliset asetukset (`.env.local`)

Luo projektin juureen `.env.local` -tiedosto (varmista, että se on mukana `.gitignore`-tiedostossa):

```env
# Valittava menetelmä: 'api-key' tai 'oauth2'
NEXT_PUBLIC_AUTH_METHOD=api-key

# API-avain (käytössä vain jos menetelmä on 'api-key')
NEXT_PUBLIC_API_KEY=oma_salainen_avain

# Taustajärjestelmän osoite
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### OAuth2 / JWT -Testauskehys

Kun käyttöliittymän asetukseksi muutetaan `NEXT_PUBLIC_AUTH_METHOD=oauth2`, yläpalkkiin (`header`) ilmestyy **🔑 Hae JWT** -testipainike.

1. Varmista, että `oauth2-mock-server` pyörii portissa 9000.
2. Klikkaa painiketta käyttöliittymässä hankkiaksesi voimassa olevan testisession.
3. Sovellus välittää tämän jälkeen automaattisesti `Authorization: Bearer <token>` -otsikon kaikkiin API-kutsuihin.


## Ympäristömuuttujat ja Tunnistautuminen

Sovellus osaa mukautua taustajärjestelmän (Spring Boot) vaatimaan tunnistautumistapaan dynaamisesti.

### Paikalliset asetukset (`.env.local`)

Luo projektin juureen `.env.local` -tiedosto (varmista, että se on mukana `.gitignore`-tiedostossa):

```env
# Valittava menetelmä: 'api-key' tai 'oauth2'
NEXT_PUBLIC_AUTH_METHOD=api-key

# API-avain (käytössä vain jos menetelmä on 'api-key')
NEXT_PUBLIC_API_KEY=oma_salainen_avain

# Taustajärjestelmän osoite
NEXT_PUBLIC_API_URL=http://localhost:8080/databricks-api/v1
```

### OAuth2 / JWT -Testauskehys

Kun käyttöliittymän asetukseksi muutetaan `NEXT_PUBLIC_AUTH_METHOD=oauth2`, yläpalkkiin (`header`) ilmestyy **🔑 Hae JWT** -testipainike.

1. Varmista, että `oauth2-mock-server` pyörii portissa 9000.
2. Klikkaa painiketta käyttöliittymässä hankkiaksesi voimassa olevan testisession.
3. Sovellus välittää tämän jälkeen automaattisesti `Authorization: Bearer <token>` -otsikon kaikkiin API-kutsuihin.

---

## OpenAPI-rajapintatyypit (TypeScript)

Projektissa käytetään automaattisesti generoituja TypeScript-tyyppejä, jotka pohjautuvat Spring Bootin tuottamaan OpenAPI 3.x -dokumentaatioon. Tyyppien juurena toimii tiedosto `src/types/api.ts`.

### Tyyppien päivittäminen taustajärjestelmästä

Kun Spring Bootin rajapintaan tai tietomalleihin (Schemas) tulee muutoksia, päivitä käyttöliittymän tyypit ajamalla seuraava komento projektin juuressa:

```bash
npx openapi-types --input http://localhost:8080/v3/api-docs --output src/types/api.ts
```
*(Muuta input-osoitetta, jos Spring Bootin Swagger-dokumentaation polku vaihtuu).*

### Tyypitysten käyttö koodissa

Generoidut tyypit poimitaan suoraan `components`-osion alta:

```typescript
import { components } from "@/types/api";

// Esimerkkejä skeemojen hyödyntämisestä
type HarjoitusYhteenveto = components["schemas"]["HarjoitusYhteenveto"];
type HarjoitusPerustieto = components["schemas"]["HarjoitusPerustieto"];
```

### Sovelluksen kääntäminen (Build / Compile)

Voit testata tyyppien yhteensopivuuden ja kääntää sovelluksen tuotantoversioon komennolla:

```bash
npm run build
```