import { getActivitiesByPermitId, takeNotam, findMrefsByPermitId} from '../api/activityAPI'
import { type Activity } from '../types/activity'
import { type Permit } from '../types/permit'

import {useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from "react"

// import { toast } from "@/components/ui/toast"

function ActivityCard({ permit }: { permit: Permit }){
  const queryClient = useQueryClient()
  const selectedRef = useRef<HTMLUListElement>(null) //tells ts what ref will hold. 
  const mrefRef = useRef<HTMLInputElement>(null)
  const takenByRef = useRef<HTMLInputElement>(null)
  
  const activitiesQuery = useQuery({
    queryKey: ["activities", permit.id],
    queryFn: () => getActivitiesByPermitId(permit.id)
  })

  const mutation = useMutation({
      mutationFn: takeNotam,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["activities", permit.id]})
        queryClient.invalidateQueries({queryKey: ["permits"]})
        queryClient.invalidateQueries({queryKey: ["mref", permit.id]})
        alert(`NOTAM ${mrefRef.current?.value} taken.`)
        // showToast()
        if (mrefRef.current) mrefRef.current.value = ""
        if (takenByRef.current) takenByRef.current.value = ""
      } 
    })
  
  if (activitiesQuery.isPending) return <p>Loading activities...</p>
  if (activitiesQuery.error) return <p>({String(activitiesQuery.error)})</p>
  if (activitiesQuery.data.length == 0) return <p>No activites to show.</p>

  function handleTakeNotam(){
    const checked = selectedRef.current?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked') ?? []
    const ids = Array.from(checked, (box)=> (Number(box.value)))

    const mref = mrefRef.current?.value.trim() ?? ""
    const takenBy = takenByRef.current?.value.trim() ?? ""

    if (ids.length === 0){
      alert("Please select at least one activity to take NOTAM.")
      return
    }

    if (!mref || !takenBy){
      alert("Please ensure the Mref and Taken By fields are filled up.")
      return
    }

    mutation.mutate({ ids, mref, takenBy })

  }
  return(
    <>
    <div className="activity-card">
        <div className="activity-card-header">
            <h2>{permit.permitNo}</h2>
            <p>Application Number: {permit.applicationNum}</p>
            <p>Number of activities left: {activitiesQuery.data.length}</p>
        </div>

        <div className="previous-notams-header">
          <p>Previous NOTAMS taken:</p>
          <ShowPreviousMrefs permitId={permit.id}/>

        </div>

          <ul ref={selectedRef}>
            {activitiesQuery.data.map((activity)=>(
              <li key={`${activity.id}`}>
                <label>
                  <input className='checkbox' type="checkbox" value={activity.id}/>
                  {activity.activityDate}, {activity.activityTime}
                </label>
              </li>
            ))}
          </ul>
        
            <div>
              <label htmlFor="mref">Mref</label>
              <input type="text" ref={mrefRef}/>
            </div>

             <div>
              <label htmlFor="takenBy">Taken By</label>
              <input type="text" ref={takenByRef}/>
            </div>
         
         
        <button type="button" onClick={handleTakeNotam} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Submit"}
        </button>
    </div>

    </>
  )
}

function ShowPreviousMrefs({permitId}: {permitId: number}){
    const mrefQuery = useQuery({
    queryKey: ["mref", permitId],
    queryFn: () => (findMrefsByPermitId(permitId))
  })

  if (mrefQuery.isPending) return <p>Loading previous NOTAMs...</p>
  if (mrefQuery.error) return <p>({String(mrefQuery.error)})</p>
  if (mrefQuery.data.length == 0) return <p>No previous NOTAMs taken.</p>

 
  return (
    <ul>
      {mrefQuery.data.map((mref) => (
        <li key={mref}>{mref}</li>
      ))}
    </ul>
  )
}


// function showToast() {
//   const id = toast.add({
//     title: "Event created",
//     description: "Sunday, December 3 at 9:00 AM",
//   })
// }





export default ActivityCard
