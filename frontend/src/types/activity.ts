// one activity as returned by the parser / sent in POST /permits
export interface NewActivity {
  activityDate: string // "30 May 2026 to 31 May 2026"
  activityTime: string // "0000LT to 2359LT"
  activityDateTime: string // ISO with +08:00, sort key
}

// GET /activities/id/:id
export interface Activity extends NewActivity {
  id: number
  permitId: number
  status: 'N' | 'Y'
  mref: string | null
  takenBy: string | null
  createdAt: string | null
}

// PATCH /activities/takenotam body
export interface takeNotam {
  ids: number[]
  mref: string
  takenBy: string
}

// PATCH /activities/cancelnotam body
export interface cancelNotam {
  mref: string
}
