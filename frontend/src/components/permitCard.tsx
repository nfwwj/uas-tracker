import { type Permit } from '../types/permit'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "cn"
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"
import { useState } from 'react'

function PermitCard({ permit, onSelect, selected }: { permit: Permit, onSelect: (permit: Permit) => void , selected: boolean | null}){
  const nextActivity = new Date(permit.activities[0].activityDateTime).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })

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
        <ItemTitle>{permit.permitNo}</ItemTitle>
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

export default PermitCard
