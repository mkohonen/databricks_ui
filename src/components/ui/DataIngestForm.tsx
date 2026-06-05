export function DataIngestForm() {
  return (
    <aside className="lg:col-span-3 bg-zinc-50 border-l border-zinc-200 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="uppercase text-xs font-bold tracking-wider text-zinc-500">Datasyöttö ja Simulaatio</div>
      <div className="self-start px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded text-[10px] font-mono font-bold shadow-sm">
        POST /ingest
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Harjoitus ID</label>
          <input type="text" defaultValue="workout-uuid-001" className="w-full h-9 px-3 bg-white border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-blue-500 shadow-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Kiihtyvyysanturi (X | Y | Z)</label>
          <input type="text" placeholder="X: 0.12  |  Y: -0.98  |  Z: 0.05" className="w-full h-9 px-3 bg-white border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-blue-500 shadow-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500 font-medium">Syke (Pulse)</label>
          <input type="text" placeholder="Pulse (Syke): 145" className="w-full h-9 px-3 bg-white border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-blue-500 shadow-sm" />
        </div>
        <button className="w-full h-9 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-md shadow transition-colors mt-2">
          Lähetä yksittäinen piste
        </button>
      </div>
    </aside>
  );
}
