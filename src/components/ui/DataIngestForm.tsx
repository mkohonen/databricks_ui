"use client"

import { useState, useEffect } from "react"
import { components } from "@/types/api"

type SensorData = components["schemas"]["SensorData"];

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/databricks-api/v1";

export function DataIngestForm() {
  const [harjoitusId, setHarjoitusId] = useState("workout-uuid-001")
  const [harjoituksenKestoMin, setHarjoituksenKestoMin] = useState(5)
  const [maxKorkeusero, setMaxKorkeusero] = useState(35)
  const [lahetysvali, setLahetysvali] = useState(1000)

  // Simulaation sisäinen tila (Kesto ja Matka molemmat mukana!)
  const [isSimulating, setIsSimulating] = useState(false)
  const [kulunutAikaSekuntia, setKulunutAikaSekuntia] = useState(0)
  const [etaisyysKuljettu, setEtaisyysKuljettu] = useState(0) // SÄILYTETTY & AUTOMATISOITU
  const [nykyinenKorkeus, setNykyinenKorkeus] = useState(0)
  const [lahetetytPisteet, setLahetetytPisteet] = useState(0)

  const tavoiteAikaSekunteina = harjoituksenKestoMin * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating) {
      interval = setInterval(async () => {

        if (kulunutAikaSekuntia >= tavoiteAikaSekunteina) {
          setIsSimulating(false);
          alert("Simulaatio valmis! Harjoituksen kesto ja matka simuloitu kokonaan.");
          return;
        }

        const aikaAskelSekunteina = lahetysvali / 1000;
        const uusiKulunutAika = Math.min(kulunutAikaSekuntia + aikaAskelSekunteina, tavoiteAikaSekunteina);

        const edistymisProsentti = uusiKulunutAika / tavoiteAikaSekunteina;
        const uusiKorkeus = Math.sin(edistymisProsentti * Math.PI * 2) * (maxKorkeusero / 2) + (maxKorkeusero / 2);

        // --- NOPEUDEN JA MATKAN SIMULOINTI ---
        const onYlamaki = uusiKorkeus > nykyinenKorkeus;

        // Lasketaan looginen nopeus m/s (metrejä sekunnissa)
        // Ylämäessä hitaampi vauhti, alamäessä/tasaisella kovempi vauhti
        const nopeusMetriaSekunnissa = onYlamaki
          ? Math.random() * 3 + 4   // n. 14–25 km/h
          : Math.random() * 4 + 8;  // n. 28–43 km/h

        // Matka kasvaa vauhdin ja kuluneen aika-askeleen mukaan
        const kertyraMatkaMetreina = nopeusMetriaSekunnissa * aikaAskelSekunteina;
        const uusiEtaisyys = etaisyysKuljettu + kertyraMatkaMetreina;
        // -------------------------------------

        const xCoord = parseFloat((Math.random() * 0.4 - 0.2).toFixed(2));
        const yCoord = parseFloat((-1.0 + (Math.random() * 0.3 - 0.15)).toFixed(2));
        const zCoord = parseFloat((Math.random() * 0.4 - 0.2).toFixed(2));

        const pulse = onYlamaki
          ? Math.floor(Math.random() * 10) + 160
          : Math.floor(Math.random() * 15) + 120;

        const uusiPiste: SensorData = {
          harjoitusId: harjoitusId,
          xCoord: xCoord,
          yCoord: yCoord,
          zCoord: zCoord,
          pulse: pulse,
          timestamp: new Date().toISOString()
        };

        try {
          const res = await fetch(`${SPRING_BOOT_URL}/ingest`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              // Korvaa 'X-API-Key' sillä nimellä, jota API:si vaatii (esim. Authorization tai Apikey)
              'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || 'sinun_api_avaimesi_tähän'
            },
            body: JSON.stringify([uusiPiste])
          });
          if (!res.ok) console.error("Ingest virhe:", res.status);
        } catch (err) {
          console.error("Yhteysvirhe simulaatiossa:", err);
        }

        setKulunutAikaSekuntia(uusiKulunutAika);
        setEtaisyysKuljettu(uusiEtaisyys); // Tallennetaan uusi kuljettu matka tilaan
        setNykyinenKorkeus(uusiKorkeus);
        setLahetetytPisteet(prev => prev + 1);

      }, lahetysvali);
    }

    return () => clearInterval(interval);
  }, [isSimulating, kulunutAikaSekuntia, etaisyysKuljettu, nykyinenKorkeus, harjoitusId, tavoiteAikaSekunteina, maxKorkeusero, lahetysvali]);

  const handleToggleSimulaatio = () => {
    if (!isSimulating) {
      setKulunutAikaSekuntia(0);
      setEtaisyysKuljettu(0);
      setNykyinenKorkeus(0);
      setLahetetytPisteet(0);
    }
    setIsSimulating(!isSimulating);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <aside className="lg:col-span-3 bg-zinc-50 border-l border-zinc-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="uppercase text-xs font-bold tracking-wider text-zinc-500">
        Datasyöttö ja Simulaatio
      </div>

      <div className="self-start px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-[10px] font-mono font-bold shadow-sm">
        POST /ingest (Automaatti)
      </div>

      {/* ASETUKSET */}
      <div className="space-y-3 bg-white p-3 rounded-lg border border-zinc-200 shadow-sm">
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Harjoitus ID</label>
          <input
            type="text"
            value={harjoitusId}
            onChange={(e) => setHarjoitusId(e.target.value)}
            disabled={isSimulating}
            className="w-full h-8 px-3 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Harjoituksen kesto (minuuttia)</label>
          <input
            type="number"
            value={harjoituksenKestoMin}
            onChange={(e) => setHarjoituksenKestoMin(Number(e.target.value))}
            disabled={isSimulating}
            min={1}
            className="w-full h-8 px-3 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Max korkeusero (m)</label>
          <input
            type="number"
            value={maxKorkeusero}
            onChange={(e) => setMaxKorkeusero(Number(e.target.value))}
            disabled={isSimulating}
            className="w-full h-8 px-3 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Lähetysväli (intervalli)</label>
          <select
            value={lahetysvali}
            onChange={(e) => setLahetysvali(Number(e.target.value))}
            disabled={isSimulating}
            className="w-full h-8 px-2 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-teal-500 disabled:opacity-50"
          >
            <option value={250}>250 ms (Erittäin nopea striimi)</option>
            <option value={500}>500 ms (2 pistettä sekunnissa)</option>
            <option value={1000}>1000 ms (1 sekunti - Vakio)</option>
            <option value={2000}>2000 ms (Harva taajuus)</option>
          </select>
        </div>

        <button
          onClick={handleToggleSimulaatio}
          className={`w-full h-9 text-xs font-bold rounded shadow transition-colors mt-2 ${isSimulating
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
        >
          {isSimulating ? "🛑 Pysäytä simulaatio" : "⚡ Käynnistä reittisimulaatio"}
        </button>
      </div>

      {/* REAALIAIKAINEN MONITOROINTI (Sekä aika että matka näytetään nätisti) */}
      {(isSimulating || lahetetytPisteet > 0) && (
        <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-[11px] space-y-1.5 border border-zinc-800 shadow-inner">
          <p className="text-teal-400 font-bold uppercase text-[9px] tracking-wider">Simulaattori käynnissä</p>
          <p>Aika: <span className="text-white font-bold">{formatTime(kulunutAikaSekuntia)}</span> / {formatTime(tavoiteAikaSekunteina)}</p>
          {/* Kuljettu matka näytetään metreinä (tai kilometreinä jos matka ylittää 1.5km) */}
          <p>Matka: <span className="text-white font-bold">
            {etaisyysKuljettu > 1500
              ? `${(etaisyysKuljettu / 1000).toFixed(2)} km`
              : `${Math.floor(etaisyysKuljettu)} m`}
          </span></p>
          <p>Korkeus: <span className="text-white font-bold">{nykyinenKorkeus.toFixed(1)} m</span></p>
          <p>Pisteitä lähetetty: <span className="text-teal-400 font-bold">{lahetetytPisteet} kpl</span></p>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-teal-500 h-1.5 transition-all duration-300"
              style={{ width: `${(kulunutAikaSekuntia / tavoiteAikaSekunteina) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="border-t border-zinc-200 my-1"></div>
    </aside>
  );
}
