import { useEffect, useState, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getActivitiesByPermitId, takeNotam } from "../api/activityAPI"
import { cn } from "cn"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError
} from "@/components/ui/field"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios"



function showToast(title: string, description: string, type: string) {
  toast.add({ title, description, type: type })
}

export default function ShowActivityTable({ permitId }: { permitId: number }){
  const queryClient = useQueryClient()

  const activitiesQuery = useQuery({
    queryKey: ["activities", permitId],
    queryFn: () => getActivitiesByPermitId(permitId),
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // useEffect(()=>{
  //   setSelectedIds([])
  // }, [permitId])

  function toggleRow(activityId: number) {
    setSelectedIds((prev) => {
    if (prev.includes(activityId)) {        // ← now checks prev
      return prev.filter((id) => id !== activityId)
    } else {
      return [...prev, activityId]
    }
  })
}

  if (activitiesQuery.isPending) return
  if (activitiesQuery.error) return <p>({String(activitiesQuery.error)})</p>

  return (
    <>
    {/* wrapper keeps the title above the table; .activity-table lays its children out in a row */}
    <div className="flex flex-col gap-2">
    <p className="text-2xl font-bold">Activities</p>
    <Table>
      <TableHeader>
        <TableRow className="cursor-default select-none hover:bg-black">
          <TableHead className="w-10 text-xl text-left"></TableHead>
          
          <TableHead>Activity Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Activity ID</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="cursor-pointer select-none">
          {activitiesQuery.data.length === 0 ? (
            <TableRow>
               <TableCell colSpan={4} className="text-center text-muted-foreground">
              No more pending activities.
            </TableCell>
            </TableRow>
          ) :
          activitiesQuery.data.map((activity) => {
          const selected = selectedIds.includes(activity.id)
          return (
            <TableRow
            key={activity.id} //need this key?
            className={cn(selected && ("bg-white text-black hover:bg-white"))}
            onClick={() => toggleRow(activity.id)}>

              <TableCell>           
                <Checkbox             
                checked={selected}/>
              </TableCell>
              
              <TableCell className="text-lg">{activity.activityDate}</TableCell>
              <TableCell className="text-lg">{activity.activityTime}</TableCell>
              <TableCell className="text-lg">{activity.id}</TableCell>
          </TableRow>
          )})}
          
          
        
      </TableBody>
    </Table>
    </div>
    {activitiesQuery.data.length > 0 && (<NotamInput selected={selectedIds} permitId={permitId} onTaken={() =>setSelectedIds([])}></NotamInput>)}
    
    </>
  )
}

export function NotamInput({selected, permitId, onTaken}: {selected: number[], permitId: number, onTaken: () => void}){
  const queryClient = useQueryClient()
  const mrefRef = useRef<HTMLInputElement>(null)
  const takenByRef = useRef<HTMLInputElement>(null)
  const check1Ref = useRef<HTMLInputElement>(null)
  const check2Ref = useRef<HTMLInputElement>(null)
  const [resetKey, setresetKey] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

 
  const mutation = useMutation({
    mutationFn: takeNotam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits"] })
      queryClient.invalidateQueries({ queryKey: ["activities", permitId] })
      queryClient.invalidateQueries({ queryKey: ["mref", permitId] })
      
      toast.add({
      title: "NOTAM created!",
      description: mrefRef.current?.value,
      type: "success"
    })
      if (mrefRef.current) mrefRef.current.value = ""
      if (takenByRef.current) takenByRef.current.value = ""
      
      setresetKey(prev => prev + 1)
      onTaken()
    },
    onError: (error) => toast.add({
      title: "Something went wrong",
      description: `${error}`,
      type: "warning"
    })
  })

  function handleSubmit(){
    setError(null)
    const mref = mrefRef.current?.value.trim() ?? ""
    const takenBy = takenByRef.current?.value.trim() ?? ""
    const checked1 = check1Ref.current?.checked ?? false
    const checked2 = check2Ref.current?.checked ?? false

    if (selected.length === 0 || !mref || !takenBy || !checked1 || !checked2) {
      toast.add({
      title: "Missing details!",
      description: `Select at least one activity, fill in Mref and Taken By, and check the boxes.`,
      type: "warning"
    })
      return
    }

    if (!/^M\d{9}$/.test(mref)) {
      setError("Ensure Mref is correctly typed.")
      return
    }

    mutation.mutate({ ids: selected, mref, takenBy })
  }

  return(
    // sticky on the wrapper, not inside the Card: it slides within .activity-table (as tall as the table)
    <div className="notam-column">
     <p className="text-2xl font-bold">Take NOTAM</p>
     <Card>
         <CardContent className="notam-form">
             <Field>
                <FieldLabel htmlFor="mref">NOTAM Mref<span className="text-destructive">*</span></FieldLabel>
                <Input id="mref" type="text" placeholder="M202601234" ref={mrefRef} required/>           
                <FieldError>{error}</FieldError>
                <FieldLabel htmlFor="takenby">Taken By<span className="text-destructive">*</span></FieldLabel>
                <Input id="takenby" type="text" placeholder="Model" ref={takenByRef} required />

            </Field>
            
            <div className="notam-check">
            <Field orientation="horizontal">
              <Checkbox id="check1" name="check1" key={resetKey} inputRef={check1Ref}/>
              <Label htmlFor="check1">The dates between two activities are not more than 7 days apart!</Label>
            </Field>

            <Field orientation="horizontal">
              <Checkbox id="check2" name="check2" key={resetKey} inputRef={check2Ref}/>
              <Label htmlFor="check2">No more than 3 DLY BTN, or more than the maximum number of activity records allowed, are being taken.</Label>
            </Field>
             </div>
             
           <Button type="button" onClick={handleSubmit} disabled={mutation.isPending} className="notam-submit">
              {mutation.isPending && <Spinner />}
              Submit
            </Button>
         </CardContent>

    </Card>
    </div>
  )
}


