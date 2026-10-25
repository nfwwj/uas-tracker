import { getActivitiesByPermitId, findMrefsByPermitId} from '../api/activityAPI'
import { type Permit } from '../types/permit'

import { useQuery } from '@tanstack/react-query'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@base-ui/react/button'

function ActivityCard({ permit }: { permit: Permit }){
  const activitiesQuery = useQuery({
    queryKey: ["activities", permit.id],
    queryFn: () => getActivitiesByPermitId(permit.id),
  })

  return(
    <>
    <p className="text-2xl font-bold">Details</p>
        <Card>
          <CardHeader>
            <CardTitle>{permit.permitNo}</CardTitle>
            <CardDescription>{permit.applicationNum}</CardDescription>
            <CardDescription>{activitiesQuery.data?.length ?? 0} activities pending</CardDescription>
          </CardHeader>
        </Card>

        <ShowPreviousMrefs permitId={permit.id} />
    </>
  )
}
function ShowPreviousMrefs({permitId}: {permitId: number}){
    const mrefQuery = useQuery({
    queryKey: ["mref", permitId],
    queryFn: () => (findMrefsByPermitId(permitId))
  })

  if (mrefQuery.isPending) return 
  if (mrefQuery.error) return <p>Error: {String(mrefQuery.error)}</p>
  if (mrefQuery.data.length == 0){
    return (
   
    <Card>
            <CardHeader>
              <CardTitle>Previous NOTAMs taken</CardTitle>
              <CardDescription>No previous NOTAMs taken.</CardDescription>
            </CardHeader>
    </Card>
) 
  } 
 return (
  <Card>
          <CardHeader>
            <CardTitle>Previous NOTAMs taken</CardTitle>
            <CardDescription>Not arranged in order.</CardDescription>
          </CardHeader>

          <CardContent>
            <Table className='cursor-default hover:bg-gray'> 
             
              <TableHeader>
                <TableRow>
                  <TableHead>Mref</TableHead>
                  <TableHead>Taken By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mrefQuery.data.map((data)=>(
                  <TableRow key={data.mref}>
                  <TableCell>{data.mref}</TableCell>
                  <TableCell>{data.takenBy}</TableCell>    
                  <TableCell>
                    <Button>test</Button>
                    </TableCell>            
                </TableRow>
                ))}
              </TableBody>
            </Table>

          </CardContent>


  </Card>
)
}



export default ActivityCard
