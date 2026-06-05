"use client"

import { useState, useEffect } from "react"
import { components } from "@/types/api"

type SensorData = components["schemas"]["SensorData"];

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/databricks-api/v1";

export function DataIngestForm() {
  // Lomakkeen syötteet automaattigenerointia varten
  const [harjoitusId, setHarjoitusId] = useState("workout-uuid-001")
  const [reitinPituus, setReitinPituus] = useState(1000) // metreinä
  const [maxKorkeusero, setMaxKorkeusero] = useState(35) // metreinä

  // Simulaation sisäinen tila
  const [isSimulating, setIsSimulating] = useState(false)
  const [etaisyysKuljettu, setEtaisyysKuljettu] = useState(0)
  const [nykyinenKorkeus, setNykyinenKorkeus] = useState(0)
  const [lahetetytPisteet, setLahetetytPisteet] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating) {
      interval = setInterval(async () => {
        // Jos reitti on kuljettu loppuun, pysäytetään simulaatio
        if (etaisyysKuljettu >= reitinPituus) {
          setIsSimulating(false);
          alert("Simulaatio valmis! Reitti lähetetty onnistuneesti.");
          return;
        }

        // Simuloidaan etenemistä (esim. 10–25 metriä per sekunti)
        const askelMetreina = Math.floor(Math.random() * 15) + 10;
        const uusiEtaisyys = Math.min(etaisyysKuljettu + askelMetreina, reitinPituus);
        
        // Generoidaan loogista kiihtyvyys- ja korkeusdataa (sini-aalto simuloimaan mäkiä)
        const edistymisProsentti = uusiEtaisyys / reitinPituus;
        const uusiKorkeus = Math.sin(edistymisProsentti * Math.PI * 2) * (maxKorkeusero / 2) + (maxKorkeusero / 2);
        
        // Kiihtyvyysanturi (X, Y, Z) - pieniä tärinöitä nollan ympärillä, Y kuvaa painovoimaa -1G
        const xCoord = parseFloat((Math.random() * 0.4 - 0.2).toFixed(2));
        const yCoord = parseFloat((-1.0 + (Math.random() * 0.3 - 0.15)).toFixed(2));
        const zCoord = parseFloat((Math.random() * 0.4 - 0.2).toFixed(2));
        
        // Simuloidaan syke (Pulse): nousee loogisesti kun ajetaan ylämäkeä
        const onYlamaki = uusiKorkeus > nykyinenKorkeus;
        const pulse = onYlamaki 
          ? Math.floor(Math.random() * 10) + 160  // Korkea syke ylämäessä
          : Math.floor(Math.random() * 15) + 120; // Alhaisempi tasaisella/alamäessä

        // Rakennetaan OpenAPI-skemasi mukainen SensorData-objekti
        const uusiPiste: SensorData = {
          harjoitusId: harjoitusId,
          xCoord: xCoord,
          yCoord: yCoord,
          zCoord: zCoord,
          pulse: pulse,
          timestamp: new Date().toISOString()
        };

        // Lähetetään piste Spring Boot API:iin (vastaanottaa SensorData-arrayn)
        try {
          const res = await fetch(`${SPRING_BOOT_URL}/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([uusiPiste]) // OpenAPI määrittää arrayn: items -> SensorData
          });

          if (!res.ok) console.error("Ingest virhe:", res.status);
        } catch (err) {
          console.error("Yhteysvirhe simulaatiossa:", err);
        }

        // Päivitetään simulaattorin näkymä
        setEtaisyysKuljettu(uusiEtaisyys);
        setNykyinenKorkeus(uusiKorkeus);
        setLahetetytPisteet(prev => prev + 1);

      }, 1000); // Lähetetään 1 piste per sekunti
    }

    return () => clearInterval(interval);
  }, [isSimulating, etaisyysKuljettu, nykyinenKorkeus, harjoitusId, reitinPituus, maxKorkeusero]);

  // Nollataan simulaattori
  const handleToggleSimulaatio = () => {
    if (!isSimulating) {
      setEtaisyysKuljettu(0);
      setNykyinenKorkeus(0);
      setLahetetytPisteet(0);
    }
    setIsSimulating(!isSimulating);
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
          <label className="text-[11px] text-zinc-500 font-medium">Reitin pituus (m)</label>
          <input 
            type="number" 
            value={reitinPituus}
            onChange={(e) => setReitinPituus(Number(e.target.value))}
            disabled={isSimulating}
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

        <button 
          onClick={handleToggleSimulaatio}
          className={`w-full h-9 text-xs font-bold rounded shadow transition-colors mt-2 ${
            isSimulating 
              ? "bg-red-600 hover:bg-red-500 text-white" 
              : "bg-teal-600 hover:bg-teal-500 text-white"
          }`}
        >
          {isSimulating ? "🛑 Pysäytä simulaatio" : "⚡ Käynnistä reittisimulaatio"}
        </button>
      </div>

      {/* REAALIAIKAINEN MONITOROINTI (Näkyy kun simulaatio pyörii) */}
      {(isSimulating || lahetetytPisteet > 0) && (
        <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-[11px] space-y-1.5 border border-zinc-800 shadow-inner">
          <p className="text-teal-400 font-bold uppercase text-[9px] tracking-wider">Simulaattori käynnissä</p>
          <p>Eteneminen: <span className="text-white font-bold">{etaisyysKuljettu}m</span> / {reitinPituus}m</p>
          <p>Korkeus: <span className="text-white font-bold">{nykyinenKorkeus.toFixed(1)} m</span></p>
          <p>Pisteitä lähetetty: <span className="text-teal-400 font-bold">{lahetetytPisteet} kpl</span></p>
          
          {/* Edistymispalkki */}
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-teal-500 h-1.5 transition-all duration-300" 
              style={{ width: `${(etaisyysKuljettu / reitinPituus) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="border-t border-zinc-200 my-1"></div>
    </aside>
  );
}
