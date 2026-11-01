import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Checkmark that pops in, draws its tick, then shows the title and a banner underneath.
// Every step is a CSS animation with a delay, so mounting it is enough to play it.
export function SuccessCheck({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* keyframes for the tick: pathLength=1 makes the dash maths independent of the path's real length */}
      <style>{`@keyframes draw-check { to { stroke-dashoffset: 0 } }`}</style>

      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 animate-in zoom-in-50 fade-in-0 duration-300">
        <svg viewBox="0 0 24 24" className="size-10 text-emerald-500" fill="none" stroke="currentColor"
          strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1}
            style={{ animation: "draw-check 400ms ease-out 250ms forwards" }} />
        </svg>
      </div>

      <p className="text-lg font-semibold animate-in fade-in-0 fill-mode-both duration-300"
        style={{ animationDelay: "450ms" }}>
        {title}
      </p>

      {message && (
        <div className="w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-center text-sm animate-in slide-in-from-bottom-4 fade-in-0 fill-mode-both duration-300"
          style={{ animationDelay: "600ms" }}>
          {message}
        </div>
      )}
    </div>
  )
}

// Test harness: card -> fade out -> checkmark. Render <SuccessDemo /> anywhere (e.g. the header nav).
export function SuccessDemo() {
  const [phase, setPhase] = useState<"card" | "leaving" | "done">("card")

  return (
    <AlertDialog onOpenChange={(open) => { if (!open) setPhase("card") }}>
      <AlertDialogTrigger render={<Button variant="ghost">Test success</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add permit</AlertDialogTitle>
        </AlertDialogHeader>

        {phase === "done" ? (
          <SuccessCheck title="Permit added!" message="AP1/20260519/0001/UOP/0011 · 12 activities saved" />
        ) : (
          <Card
            // fill-mode-forwards keeps it invisible after fading; onAnimationEnd swaps in the checkmark
            className={phase === "leaving" ? "animate-out fade-out-0 zoom-out-95 fill-mode-forwards duration-300" : undefined}
            onAnimationEnd={() => { if (phase === "leaving") setPhase("done") }}
          >
            <CardHeader>
              <CardTitle>AP1/20260519/0001/UOP/0011</CardTitle>
              <CardDescription>CAAS/AP1/2026/1760</CardDescription>
              <CardDescription>1200 ft · Class 2</CardDescription>
            </CardHeader>
          </Card>
        )}

        <AlertDialogFooter>
          {phase === "done" ? (
            <AlertDialogCancel>Close</AlertDialogCancel>
          ) : (
            <Button onClick={() => setPhase("leaving")} disabled={phase === "leaving"}>Add Permit</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
