import { components } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type HarjoitusPerustietoType = components["schemas"]["HarjoitusPerustieto"];

interface HarjoitusPerustietoProps {
  data: HarjoitusPerustietoType;
}

export function HarjoitusPerustieto({ data }: HarjoitusPerustietoProps) {
  const formatedDate = data.startTime 
    ? new Date(data.startTime).toLocaleDateString("fi-FI") 
    : "";

  return (
    <Card className="bg-white border-zinc-200 shadow-sm">
      <CardContent className="p-4 space-y-2">
        
        {/* HARJOITUS ID JA TILA SAMALLA RIVILLÄ (flex-row & justify-between) */}
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-zinc-800 font-mono truncate max-w-[140px]">
            {data.harjoitusId}
          </h4>
          
          {/* Tila-badge siirretty tänne yläriville */}
          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
            data.status === "ACTIVE" ? "bg-blue-50 text-blue-700 border border-blue-200" :
            data.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {data.status}
          </span>
        </div>
        
        {/* Alemmat metatiedot (Laji ja Aika) */}
        <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-zinc-100 pt-2">
          <div>
            <p className="text-zinc-400">Laji</p>
            <p className="font-semibold text-zinc-700 truncate">{data.sportType}</p>
          </div>
          <div>
            <p className="text-zinc-400">Aloitusaika</p>
            <p className="font-semibold text-zinc-700">{formatedDate}</p>
          </div>
        </div>

        {/* Valinnainen kuvaus */}
        {data.description && (
          <div className="text-[11px] text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100 mt-1 italic line-clamp-1">
            {data.description}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
