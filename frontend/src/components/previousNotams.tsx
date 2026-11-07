import { getActivities, findMrefsByPermitId, deleteNotam, editNotam} from '../api/activityAPI'
import type {Permit } from '../types/permit'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Separator } from "@/components/ui/separator"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import { toast } from "@/components/ui/toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Trash2Icon, SquarePen } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from './ui/spinner'
import { useRef, useState } from 'react'

function ShowPreviousMrefs({permitId}: {permitId: number}){

    const [selectedMref, setselectedMref] = useState<string | null>(null)

    function cancel(){
      setselectedMref(null)
    }

    const mrefQuery = useQuery({
    queryKey: ["mref", permitId],
    queryFn: () => (findMrefsByPermitId(permitId))
  })

  if (mrefQuery.isPending) return 
  if (mrefQuery.error) return <p>Error: {String(mrefQuery.error)}</p>
  if (mrefQuery.data.length == 0){
    return (
    <>
    <p className="text-2xl font-bold animate-enter"  style={{ animationDelay: "250ms" }} >Previous NOTAMs</p>
    <Card className="animate-enter" style={{ animationDelay: "250ms" }}>
            <CardHeader>
              <CardTitle>Previous NOTAMs taken</CardTitle>
              <CardDescription>No previous NOTAMs taken.</CardDescription>
            </CardHeader>
    </Card>
    </>
) 
  } 
 return (
    <>
    <p className="text-2xl font-bold animate-enter" style={{ animationDelay: "250ms" }}>Previous NOTAMs</p>
  <Card className="animate-enter" style={{ animationDelay: "250ms" }}>
          <CardHeader>
            <CardTitle>Previous NOTAMs taken</CardTitle>
            <CardDescription>Not arranged in order.</CardDescription>
          </CardHeader>

          <CardContent>
            <Table> 
             
              <TableHeader>
                <TableRow className="cursor-default hover:bg-transparent">
                  <TableHead>Mref</TableHead>
                  <TableHead>Taken By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {mrefQuery.data.map((data)=>(
                  <TableRow key={data.mref} className="cursor-default hover:bg-transparent">
            
                  <TableCell>
                    <ShowNotamActivities permitId={permitId} mref={data.mref} />
                  </TableCell>
                
                  <TableCell>{data.takenBy}</TableCell>    
                  <TableCell className="w-px whitespace-nowrap">
                     <div className="flex items-center justify-end gap-1">
                        <EditNotam mref={data.mref} permitId={permitId}></EditNotam>
                        <DeleteNotam mref={data.mref} permitId={permitId}></DeleteNotam>
                      </div>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>

          </CardContent>
  </Card>

  
  </>
)
}

 function DeleteNotam({mref, permitId}: {mref: string, permitId: number}) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteNotam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permits"] })
      queryClient.invalidateQueries({ queryKey: ["activities", permitId] })
      queryClient.invalidateQueries({ queryKey: ["mref", permitId] })

      toast.add({
      title: "NOTAM deleted successfully.",
      description: mref,
      type: "success"
    })
    
  },
  onError: (error) => {
    toast.add({
      title: "Something went wrong.",
      description: `Error ${error.response?.data.statusCode ?? "XXX"} (${error.response?.statusText ?? "Server error"}): ${error.response?.data.message ?? "Something went wrong."} `,
      type: "error"
    })
  }
})

  function handleDelete(){
    mutation.mutate({ mref: mref })
  }


  return (
    <AlertDialog >
      <AlertDialogTrigger
        render={<Button variant="destructive" className="cursor-pointer"><Trash2Icon /></Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete NOTAM {mref}?</AlertDialogTitle>
          <AlertDialogDescription>
            This NOTAM will be deleted, and the activities set back to being untaken.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={mutation.isPending}>
            {mutation.isPending && (<Spinner></Spinner>)}
            Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

 function EditNotam({mref, permitId}: {mref: string, permitId: number}) {
  const queryClient = useQueryClient()
  const newmrefRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: editNotam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mref", permitId] })

      toast.add({
      title: "NOTAM edited successfully.",
      description: mref,
      type: "success"
    })
    
  },
  onError: (error) => {
    toast.add({
      title: "Something went wrong.",
      description: `Error ${error.response?.data.statusCode ?? "XXX"} (${error.response?.statusText ?? "Server error"}): ${error.response?.data.message ?? "Something went wrong."} `,
      type: "error"
    })
  }
})

  function handleEdit(){
    const mrefData = newmrefRef.current?.value.trim() ?? ""

    if (!/^M\d{9}$/.test(mrefData)) {
      toast.add({
      title: "Missing Mref!",
      description: `Mref can't be empty!`,
      type: "warning"
      })

      return
    }
    mutation.mutate({ oldMref: mref, newMref: mrefData, permitId: permitId })

  }


  return (
    <AlertDialog >
      <AlertDialogTrigger
        render={<Button variant="outline" className="cursor-pointer"><SquarePen /></Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <SquarePen />
          </AlertDialogMedia>
          <AlertDialogTitle>Edit NOTAM</AlertDialogTitle>
          <AlertDialogDescription>
            The mref of this NOTAM will be changed
            
          </AlertDialogDescription>

          <Field>
          
            <Input id="newmref" type="text" placeholder="M202601234" ref={newmrefRef} />
            
          </Field>

        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEdit} disabled={mutation.isPending}>
            {mutation.isPending && (<Spinner></Spinner>)}
            Edit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

}


function ShowNotamActivities({permitId, mref}: {permitId: number, mref: string | null}){

   const activitiesQuery = useQuery({
    queryKey: ["activities", permitId, mref],
    queryFn: () => getActivities(permitId, mref ?? undefined),
  });

   return (
    <Popover >
      <PopoverTrigger
          render={
            <button
              type="button"
              className="cursor-pointer font-medium text-primary underline underline-offset-4 hover:text-primary/70"
            />
          }
        >
          {mref}
        </PopoverTrigger>
      {/* w-fit replaces the base w-72: the popup sizes to its table */}
      <PopoverContent className="w-fit">
        <PopoverHeader>
          <PopoverTitle>{mref}</PopoverTitle>
          <PopoverDescription>Activities covered by this NOTAM.</PopoverDescription>
        </PopoverHeader>
        
         <Table> 
             
              <TableHeader>
                <TableRow className="cursor-default hover:bg-transparent">
                  <TableHead>Activity Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {activitiesQuery.data?.map((data)=>(
                  <TableRow key={data.activityDate} className="cursor-default hover:bg-transparent text-xs">
            
                  <TableCell>
                    {data.activityDate}
                  </TableCell>

                  <TableCell>
                    {data.activityTime}
                  </TableCell>
                
                </TableRow>
                ))}
              </TableBody>
            </Table>
          
      </PopoverContent>
    </Popover>
  );
}























// function ShowNotamActivities({permitId, mref, onCancel}: {permitId: number, mref: string | null, onCancel : () => void}){

//    const activitiesQuery = useQuery({
//     queryKey: ["activities", permitId, mref],
//     queryFn: () => getActivities(permitId, mref ?? undefined),
//   });

//   return(
//   <>
//   <AlertDialog open={mref ? true : false}>
//     <AlertDialogContent className="sm:max-w-2xl">
//         <AlertDialogHeader>
//           <AlertDialogTitle>{mref}</AlertDialogTitle>
//           <AlertDialogDescription>
//             Activities covered by this NOTAM.
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <div className="max-h-80 overflow-y-auto">
//           {activitiesQuery.isPending && <Spinner />}

//           {activitiesQuery.isError && (
//             <p className="text-sm text-destructive">
//               Failed to load activities.
//             </p>
//           )}

//           {activitiesQuery.data?.length === 0 && (
//             <p className="text-sm text-muted-foreground">No activities found.</p>
//           )}

//           {activitiesQuery.data && activitiesQuery.data.length > 0 && (
//             <Table>
//               <TableHeader>
//                 <TableRow className="hover:bg-transparent">
//                   <TableHead className="w-12">#</TableHead>
//                   <TableHead>Date &amp; time</TableHead>
//                   <TableHead>Status</TableHead>
//                   {/* add headers for other Activity fields here */}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {activitiesQuery.data.map((activity, index) => (
//                   <TableRow key={activity.id}>
//                     <TableCell className="text-muted-foreground">
//                       {index + 1}
//                     </TableCell>
//                     <TableCell className="whitespace-nowrap">
//                       {activity.activityDateTime}
//                     </TableCell>
//                     <TableCell>{activity.status}</TableCell>
//                     {/* and the matching cells here */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </div>

//         <AlertDialogFooter>
//           <AlertDialogCancel onClick={onCancel}>Close</AlertDialogCancel>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
  
//   </>
//   )
// }











export default ShowPreviousMrefs