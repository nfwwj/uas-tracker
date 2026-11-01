import server from "./server"
import type { Activity, cancelNotam, takeNotam } from "../types/activity"

export async function getActivitiesByPermitId(permitId: number) {
    // activityCard and activityTable
    const response = await server.get<Activity[]>(`/activities/id/${permitId}`)
    return response.data
}

export async function findMrefsByPermitId(permitId: number) {
    // activityTable
    const response = await server.get<{ mref: string, takenBy: string }[]>(`/activities/mrefs/${permitId}`)
    return response.data
}

export async function takeNotam(data: takeNotam) {
    // activityTable mutation
    const response = await server.patch(`/activities/takenotam`, data)
    return response.data
}

export async function deleteNotam(data: cancelNotam) {
    const response = await server.patch(`/activities/cancelnotam`, data)
    return response.data
}
