import server from "./server"
import type { Activity, cancelNotam, editNotam, takeNotam } from "../types/activity"

export async function getActivities(permitId: number, mref?: string) {
    // detailsCard + activityTable (pending); mref dialog (with mref). axios drops mref when undefined
    const response = await server.get<Activity[]>(`/activities`, { params: { permitId, mref } })
    return response.data
}

export async function findMrefsByPermitId(permitId: number) {
    // activityTable
    const response = await server.get<{ mref: string, takenBy: string }[]>(`/activities/mrefs`, { params: { permitId } })
    return response.data
}

export async function takeNotam(data: takeNotam) {
    // activityTable mutation
    const response = await server.patch(`/activities/take-notam`, data)
    return response.data
}

export async function deleteNotam(data: cancelNotam) {
    const response = await server.patch(`/activities/cancel-notam`, data)
    return response.data
}

export async function editNotam(data: editNotam){
    const response = await server.patch(`/activities/edit-notam`,data)
    return response.data //?
}
