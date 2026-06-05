"use client"

import { components } from "@/types/api"
import { useRouter, useSearchParams } from "next/navigation"
import { HarjoitusPerustieto } from "./HarjoitusPerustieto"

// Poimitaan tyyppi suoraan generoidusta api.ts -tiedostosta
type HarjoitusPerustietoType = components["schemas"]["HarjoitusPerustieto"];

interface WorkoutListProps {
  initialHarjoitukset: HarjoitusPerustietoType[];
}

export function WorkoutList({ initialHarjoitukset }: WorkoutListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Luetaan nykyinen valittu ID osoiteriviltä
  const currentSelectedId = searchParams.get("id")

  const handleSelect = (id: string) => {
    router.push(`?id=${id}`)
  }

  return (
    <aside className="lg:col-span-3 bg-zinc-100 border-r border-zinc-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="uppercase text-xs font-bold tracking-wider text-zinc-500">
        Harjoitukset
      </div>
      
      <input 
        type="text" 
        placeholder="Hae harjoitusta..." 
        className="w-full h-9 px-3 bg-white border border-zinc-300 rounded-md text-xs placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
      />
      
      <div className="space-y-3">
        {initialHarjoitukset.length === 0 ? (
          <p className="text-xs text-zinc-400 italic text-center py-4">Ei harjoituksia saatavilla.</p>
        ) : (
          initialHarjoitukset.map((harjoitus) => {
            const isSelected = currentSelectedId === harjoitus.harjoitusId;

            return (
              <div 
                key={harjoitus.harjoitusId} 
                onClick={() => handleSelect(harjoitus.harjoitusId)}
                className={`rounded-lg transition-all ${
                  isSelected 
                    ? "ring-2 ring-blue-600 shadow-md transform scale-[1.01]" 
                    : "hover:bg-zinc-200/50"
                }`}
              >
                <HarjoitusPerustieto data={harjoitus} />
              </div>
            )
          })
        )}
      </div>
    </aside>
  );
}
