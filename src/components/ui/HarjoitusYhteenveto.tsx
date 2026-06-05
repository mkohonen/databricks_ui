import { components } from "@/types/api"
// Korjattu: Tuotu myös CardDescription mukaan import-riville
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type HarjoitusYhteenvetoType = components["schemas"]["HarjoitusYhteenveto"];

interface HarjoitusYhteenvetoProps {
  data: HarjoitusYhteenvetoType;
}

export function HarjoitusYhteenveto({ data }: HarjoitusYhteenvetoProps) {
  // Aputoiminto sekuntien muuttamiseksi minuuteiksi
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}min ${secs}s`;
  };

  return (
    // Korjattu: Kommentti ja koodi kääritty React Fragmentiin (<> ... </>)
    <>
      {/* KPI Yhteenvetokortit kytkettynä oikeaan API-dataan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Kesto-kortti */}
        <Card className="bg-white border-zinc-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[11px] uppercase tracking-wider text-zinc-400">
              Kesto (Kokonais / Nousu)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-lg font-bold text-zinc-800">
              {formatTime(data.totalDurationSeconds)} / {data.climbingDurationSeconds}s
            </p>
          </CardContent>
        </Card>
        
        {/* 2. Matka-kortti */}
        <Card className="bg-white border-zinc-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[11px] uppercase tracking-wider text-zinc-400">
              Matka ja Kaltevuus
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-lg font-bold text-zinc-800">
              {data.totalDistanceMeters} m / {data.averageSlopePercentage} %
            </p>
          </CardContent>
        </Card>
        
        {/* 3. Syke-kortti (Pinkki teema draw.io:sta) */}
        <Card className="bg-pink-50 border-pink-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[11px] uppercase tracking-wider text-pink-700/70">
              Syke (Keskisyke / Max)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-lg font-bold text-pink-700">
              {data.avgPulse} / {data.maxPulse} bpm
            </p>
          </CardContent>
        </Card>

      </div>
    </>
  )
}
