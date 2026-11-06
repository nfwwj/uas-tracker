import { useState, useEffect } from 'react'
import { getPermits, getTotalNumPermits } from '../api/permitAPI'
import { type Permit} from '../types/permit'



import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "cn"
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"

function DisplayPermits({ onSelect, selectedId }: {onSelect: (permit: Permit) => void, selectedId: number | null}){
  
  const { data: permits = [], error, isPending } = useQuery({
    queryKey: ["permits"],
    queryFn: getPermits,
  })

  // key starts with "permits", so invalidateQueries({ queryKey: ["permits"] }) after a write refetches this too
  const { data: total } = useQuery({
    queryKey: ["permits", "count"],
    queryFn: getTotalNumPermits,
  })


  if (isPending){
    return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Spinner />
      <span>Loading permits...</span>
    </div>
  )
  } 
  if (error) return <p>({String(error)})</p>
  if (permits.length == 0) return <p>No permits to show. Be the first to add one!</p>

 

  return(
   <>

   <p className="text-2xl font-bold animate-enter">Permits</p>
      {permits.map((permit, i)=>(
        <div key={permit.id} className="animate-enter" style={{ animationDelay: `${i * 400}ms` }}>
          <PermitCard permit={permit} onSelect={onSelect} selected={permit.id === selectedId}/>
        </div>
      ))}


       <p className='text-sm text-muted-foreground animate-enter' style={{animationDelay:`${permits.length * 400}ms` }}>Dislaying {permits.length} of {total} permits</p>
      <p className='text-sm text-muted-foreground animate-enter' style={{animationDelay:`${permits.length * 400}ms` }}>Arranged by starting date.</p>
       <p className='text-sm text-muted-foreground animate-enter' style={{animationDelay:`${permits.length * 400}ms` }}>Refreshed on every new entry.</p>
     
  </>
  )
}


function PermitCard({ permit, onSelect, selected }: { permit: Permit, onSelect: (permit: Permit) => void , selected: boolean | null}){
  const nextActivity = new Date(permit.activities[0].activityDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' })

  return(
    <Item
      variant="outline"
      size="default"
      render={<button type="button" />}
      onClick={() => onSelect(permit)}
      className={cn(
        'cursor-pointer hover:bg-muted',
        selected && ("bg-white text-black hover:bg-white")
      )}
      
 
      
    >
      <ItemContent>
        <ItemTitle>{permit.applicationNum}</ItemTitle>
        <ItemDescription>      
          Next activity: {nextActivity}
        </ItemDescription>
        <span className={cn("rounded-md px-2 py-1 text-xs text-xs w-fit",
          selected && ("bg-black text-white")
        )}>
          {permit._count.activities} pending
        </span>
      </ItemContent>
      <ItemActions>
        
        <ChevronRightIcon className="size-4" />
      </ItemActions>
    </Item>
  )
}

export default DisplayPermits
