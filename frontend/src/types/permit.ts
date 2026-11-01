import type { NewActivity } from './activity'

// /GET /permits (used as state type for frontend components)
// used in permit API
export interface Permit {
  id: number
  permitNo: string
  applicationNum: string
  _count: { activities: number } 
  activities: { activityDateTime: string }[] 
  altitudeFt: number
  class: number
  coordinates: string
}

// POST /permits/parse response (what py server return)
// used in permit API
export interface ParsedPermit {
  permitNo: string
  applicationNum: string
  altitudeFt: number
  class: number
  coordinates: string
  activities: NewActivity[]
}

// POST /permits body
// used in permitAPI
export interface createPermitandActivities extends ParsedPermit {
  fullText?: string
}
