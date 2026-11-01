import { useEffect, useState } from 'react'
import DisplayPermits from './components/DisplayPermits'
import ActivityCard from './components/activityCard'

import { type Permit } from './types/permit'

import ShowActivityTable from './components/activityTable'
import { Toaster } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

import { ThemeProvider } from "@/components/theme-provider"
import { AddPermitDialog } from './components/addPermit'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { PlusIcon } from 'lucide-react'

export default function App() {
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)

  return(
    <>
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3">
    <span className="text-lg font-semibold">Tracker 9000</span>
    <nav className="flex gap-2">
      {/* <Button variant="ghost">Add permit</Button> */}
     <AddPermitDialog />
  
    </nav>
  </header>
    <main className="main-layout">
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster timeout={3500} />
        
            <div className="permit-column">
              <DisplayPermits onSelect={setSelectedPermit} selectedId={selectedPermit?.id} />
            </div>

            <div className="activity-column">
              {selectedPermit && (
                <ActivityCard key={selectedPermit.id} permit={selectedPermit} />

              )
              }
            </div>
            <div className='activity-table'>
              {selectedPermit && (<ShowActivityTable key= {selectedPermit.id }permitId={selectedPermit.id}></ShowActivityTable>)}
              
            </div>
        </ThemeProvider>
    </main>

    </>
  )
}

