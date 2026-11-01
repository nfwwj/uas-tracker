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

import PermitCard from './permitCard'
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

export default DisplayPermits
