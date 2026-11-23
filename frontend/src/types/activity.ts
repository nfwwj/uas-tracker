// Each object (dict) in response from POST /permits/parse (what py server returns) and POST /permits body
export interface NewActivity {
  activityDate: string 
  activityTime: string 
  activityDateTime: string // ISO with +08:00, sort key
}

// GET /activities/id/:id response
// used in activity API getActivities
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

export interface editNotam {
  permitId: number
  oldMref: string
  newMref: string
}
