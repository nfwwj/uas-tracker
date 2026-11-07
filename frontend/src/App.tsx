import { useEffect, useState } from 'react'
import DisplayPermits from './components/displayPermits'
import DetailsCard from './components/detailsCard'

import { type Permit } from './types/permit'

import ShowActivityTable from './components/activityTable'
import { Toaster } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

import { ThemeProvider } from "@/components/theme-provider"
import { AddPermitDialog } from './components/addPermit'

import { PermitSearch} from './components/searchBar'

import { PlusIcon, Plane  } from 'lucide-react'

import ShowPreviousMrefs from "./components/previousNotams"

export default function App() {
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)

  return(
    <>
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3"> 

        <div className='flex items-center cursor-pointer'>
          <Plane className='h-5 w-5' />
          <span className="text-lg font-semibold">AirTrack</span>
        </div>
        
   
    
    <nav className="flex gap-2">
      {/* <Button variant="ghost">Add permit</Button> */}
     <PermitSearch onSelect={setSelectedPermit} />
     <AddPermitDialog />

    </nav>
  </header>
    <main className="main-layout">
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster timeout={3500} />
        
            <div className="permit-column">
              <DisplayPermits onSelect={setSelectedPermit} selectedId={selectedPermit?.id} />
            </div>

            <div className="details-column">
              {selectedPermit && (
                <DetailsCard key={selectedPermit.id} permit={selectedPermit} />

              )
              }
            </div>
            <div className='activity-table'>
              {selectedPermit && (<ShowActivityTable key= {selectedPermit.id } permitId={selectedPermit.id}></ShowActivityTable>)}
              
            </div>

            <div className='previousnotams-column'>
              {selectedPermit && ( <ShowPreviousMrefs key= {selectedPermit.id } permitId={selectedPermit.id} />)}
            </div>
        </ThemeProvider>
    </main>

    </>
  )
}

