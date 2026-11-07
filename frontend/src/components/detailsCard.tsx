import { getActivities, findMrefsByPermitId, deleteNotam} from '../api/activityAPI'
import { type Permit } from '../types/permit'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

function DetailsCard({ permit }: { permit: Permit }){
  const activitiesQuery = useQuery({
    queryKey: ["activities", permit.id],
    queryFn: () => getActivities(permit.id),
  })

  return(
    <>
    <p className="text-2xl font-bold animate-enter">Details</p>
        <Card className="animate-enter">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground animate-pulse">CURRENTLY DISPLAYING</p>
            <CardTitle>{permit.applicationNum}</CardTitle>
            <CardDescription>{permit.altitudeFt} ft · Class {permit.class}</CardDescription>
            <CardDescription>{permit.coordinates}</CardDescription>
            <CardDescription>{activitiesQuery.data?.length ?? 0} activities pending</CardDescription>
            {/* <CardDescription>Permit ID {permit.id ?? "?"} · Created at {permit.createdAt ?? }</CardDescription> */}
          </CardHeader>
        </Card>      
    </>
  )
}
// function ShowPreviousMrefs({permitId}: {permitId: number}){
//     const mrefQuery = useQuery({
//     queryKey: ["mref", permitId],
//     queryFn: () => (findMrefsByPermitId(permitId))
//   })

//   if (mrefQuery.isPending) return 
//   if (mrefQuery.error) return <p>Error: {String(mrefQuery.error)}</p>
//   if (mrefQuery.data.length == 0){
//     return (
   
//     <Card className="animate-enter" style={{ animationDelay: "75ms" }}>
//             <CardHeader>
//               <CardTitle>Previous NOTAMs taken</CardTitle>
//               <CardDescription>No previous NOTAMs taken.</CardDescription>
//             </CardHeader>
//     </Card>
// ) 
//   } 
//  return (
//   <Card className="animate-enter" style={{ animationDelay: "75ms" }}>
//           <CardHeader>
//             <CardTitle>Previous NOTAMs taken</CardTitle>
//             <CardDescription>Not arranged in order.</CardDescription>
//           </CardHeader>

//           <CardContent>
//             <Table> 
             
//               <TableHeader>
//                 <TableRow className="cursor-default hover:bg-transparent">
//                   <TableHead>Mref</TableHead>
//                   <TableHead>Taken By</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody >
//                 {mrefQuery.data.map((data)=>(
//                   <TableRow key={data.mref} className="cursor-default hover:bg-transparent">
//                   <TableCell>{data.mref}</TableCell>
//                   <TableCell>{data.takenBy}</TableCell>    
//                   <TableCell className="w-px whitespace-nowrap">
//                      <div className="flex items-center justify-end gap-1">
//                         <EditNotam mref={data.mref} permitId={permitId}></EditNotam>
//                         <DeleteNotam mref={data.mref} permitId={permitId}></DeleteNotam>
//                       </div>
//                   </TableCell>
//                 </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//           </CardContent>


//   </Card>
// )
// }

// export function DeleteNotam({mref, permitId}: {mref: string, permitId: number}) {
//   const queryClient = useQueryClient()
//   const mutation = useMutation({
//     mutationFn: deleteNotam,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["permits"] })
//       queryClient.invalidateQueries({ queryKey: ["activities", permitId] })
//       queryClient.invalidateQueries({ queryKey: ["mref", permitId] })

//       toast.add({
//       title: "NOTAM deleted successfully.",
//       description: mref,
//       type: "success"
//     })
    
//   },
//   onError: (error) => {
//     toast.add({
//       title: "Something went wrong.",
//       description: `Error ${error.response?.data.statusCode ?? "XXX"} (${error.response?.statusText ?? "Server error"}): ${error.response?.data.message ?? "Something went wrong."} `,
//       type: "error"
//     })
//   }
// })

//   function handleDelete(){
//     mutation.mutate({ mref: mref })
//   }


//   return (
//     <AlertDialog >
//       <AlertDialogTrigger
//         render={<Button variant="destructive" className="cursor-pointer"><Trash2Icon /></Button>}
//       />
//       <AlertDialogContent size="sm">
//         <AlertDialogHeader>
//           <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
//             <Trash2Icon />
//           </AlertDialogMedia>
//           <AlertDialogTitle>Delete NOTAM {mref}?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This NOTAM will be deleted, and the activities set back to being untaken.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
//           <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={mutation.isPending}>
//             {mutation.isPending && (<Spinner></Spinner>)}
//             Delete</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

// export function EditNotam({mref, permitId}: {mref: string, permitId: number}) {
//   const queryClient = useQueryClient()
//   const mutation = useMutation({
//     mutationFn: deleteNotam,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["mref", permitId] })

//       toast.add({
//       title: "NOTAM edited successfully.",
//       description: mref,
//       type: "success"
//     })
    
//   },
//   onError: (error) => {
//     toast.add({
//       title: "Something went wrong.",
//       description: `Error ${error.response?.data.statusCode ?? "XXX"} (${error.response?.statusText ?? "Server error"}): ${error.response?.data.message ?? "Something went wrong."} `,
//       type: "error"
//     })
//   }
// })

//   function handleEdit(){
//     mutation.mutate({ mref: mref })
//   }


//   return (
//     <AlertDialog >
//       <AlertDialogTrigger
//         render={<Button  className="cursor-pointer"><SquarePen /></Button>}
//       />
//       <AlertDialogContent size="sm">
//         <AlertDialogHeader>
//           <AlertDialogMedia>
//             <SquarePen />
//           </AlertDialogMedia>
//           <AlertDialogTitle>Edit NOTAM</AlertDialogTitle>
//           <AlertDialogDescription>
//             The mref of this NOTAM will be changed
            
//           </AlertDialogDescription>

//           <Field>
          
//             <Input id="input-demo-api-key" type="text" placeholder="M202601234" />
            
//           </Field>

//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={handleEdit} disabled={mutation.isPending}>
//             {mutation.isPending && (<Spinner></Spinner>)}
//             Edit</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }




export default DetailsCard
