import type { NewActivity } from './activity'

// GET /permits (getPendingPermits): one card on the home page
export interface Permit {
  id: number
  permitNo: string
  applicationNum: string
  _count: { activities: number } // number of pending (status N) activities
  activities: { activityDateTime: string }[] // soonest pending activity only
}

// POST /permits/parse response (py-interface.json)
export interface ParsedPermit {
  permitNo: string
  applicationNum: string
  altitudeFt: number
  class: number
  activities: NewActivity[]
}

// POST /permits body
export interface createPermitandActivities extends ParsedPermit {
  fullText: string
}
