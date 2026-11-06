import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { SearchIcon } from "lucide-react"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"
import type { Permit, searchedPermit} from "@/types/permit"

import { searchPermits } from "@/api/permitAPI"

export function PermitSearch({ onSelect }: { onSelect: (permit: Permit) => void }) {
  const [q, setQ] = useState<string>("")
  const [searchBy, setsearchBy] = useState<string>("Application Number")

  const ready = q.trim().length >= 2

  const search = useQuery({
    queryKey: [q],
    queryFn: () => searchPermits(q),
    enabled: ready, //?
    placeholderData: keepPreviousData //?
  })

  const options = ["Application Number", "Mref"]

  return (
    <>
     <Combobox items={options}>
      <ComboboxInput placeholder="Search By" className="w-48" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>

    <Combobox
      items={search.data ?? []}
      filter={null} 
      inputValue={q}
      onInputValueChange={setQ}
      autoHighlight
    
    >
     
      <ComboboxInput placeholder="CAAS/AP1/2026/1760" showTrigger={false} className="w-72">
      <InputGroupAddon align="inline-end">
          <SearchIcon />
        </InputGroupAddon>
      </ComboboxInput>

      <ComboboxContent>
        <ComboboxEmpty>
          {search.isFetching ? "Searching..." : "No permits found."}  
        </ComboboxEmpty>
        
        <ComboboxList>
          {(permitData) => (
            <ComboboxItem key={permitData.id} onClick={() => onSelect(permitData)}>
              {permitData.applicationNum}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    </>
  )

}