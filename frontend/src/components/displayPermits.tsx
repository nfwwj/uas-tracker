import { useState, useEffect } from 'react'
import { getPermits } from '../api/permitAPI'
import { type Permit} from '../types/permit'

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import PermitCard from './permitCard'

function DisplayPermits({ onSelect, selectedId }: {onSelect: (permit: Permit) => void, selectedId: number | null}){

  const { data: permits = [], error, isPending } = useQuery({
    queryKey: ["permits"],
    queryFn: getPermits,
  })

  if (isPending) return <p>Loading permits...</p>
  if (error) return <p>({String(error)})</p>
  if (permits.length == 0) return <p>No permits to show. Be the first to add one!</p>

  console.log("permits: ",permits)

  return(
   <>

   <p className="text-2xl font-bold">Permits</p>
      {permits.map((permit)=>(
        <PermitCard key={`${permit.id}`} permit={permit} onSelect={onSelect} selected={permit.id === selectedId}/>
      ))}
   
  </>
  )
}

export default DisplayPermits
