import {
  Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"

import { useQuery } from "@tanstack/react-query"
import { getMonthSummary } from "../api/permitAPI"

// Placeholder values: swap for GET /stats/activities later
const months = [
  { month: "November 2026", note: "This month", days: "6 days to go",     permits: 5, activities: 16, coveredPct: 38 },
  { month: "December 2026", note: "Next month", days: "Starts in 6 days", permits: 2, activities: 9,  coveredPct: 11 },
]
const notamsTaken = 12

export function StatsStrip() {
    const { data, isPending } = useQuery({
    queryKey: ["permits", "summary"],
    queryFn: getMonthSummary,
  })

   if (isPending){
    return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span>Generating summary...</span>
    </div>
  )
  }

  if (!data){
    return
  }

   const months = [
    { label: "This month", summary: data?.current },
    { label: "Next month", summary: data?.next },
  ]

  return (
    <>
   
     <div className="flex flex-[7] gap-2">
      {months.map(({ label, summary }) => {
        const data = summary.data[0]

        const left = data.pending - data.expired
        const takeable = data.total - data.expired
        const coveredPct = takeable === 0 ? 0 : Math.round(data.completed / takeable * 100)
 
        return (
          <Card key={summary.month} className="flex-1  max-w-none!">
            <CardHeader>
              <CardTitle className="text-2xl">{summary.month} {summary.year}</CardTitle>
            <CardDescription>{data.permits} {data.permits === 1 ? "Permit" : "Permits"} · {data.total} Activities</CardDescription>
           
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-5">
        
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold font-mono">{left}</span>
                <span className="text-muted-foreground">{left == 1 ? "activity" : "activities"} remaining</span>
                 {data.expired > 0 && (
                   <span className="ml-auto rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive/80">{data.expired} expired</span>
                    )}
              </div>
              <Progress value={coveredPct} className="[&_[data-slot=progress-indicator]]:bg-yellow-400"/>
 
            </CardContent>
          </Card>
        )
      })}
      </div>

      <div className="flex flex-[3]">
        <Card className="flex-1  max-w-none!">
        <CardHeader>
          <CardTitle className="text-2xl">NOTAMs taken</CardTitle>
          <CardDescription>{data.current.month} {data.current.year}</CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <span className="text-5xl font-semibold font-mono">{data.current.data[0].notams}</span>
        </CardContent>
      </Card>
      </div>
    </>
  )
}