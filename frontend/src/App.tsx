import { useEffect, useState } from 'react'
import DisplayPermits from './components/displayPermits'
import ActivityCard from './components/activityCard'

import { type Permit } from './types/permit'

import ShowActivityTable from './components/activityTable'
import { Toaster } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

import { ThemeProvider } from "@/components/theme-provider"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function App() {
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)

  return(
    <>
    <header className="flex items-center justify-between border-b px-6 py-3">
    <span className="text-lg font-semibold">UAS Permit Tracker</span>
    <nav className="flex gap-2">
      <Button variant="ghost">Permits</Button>
      <Button variant="ghost">Add permit</Button>
    </nav>
  </header>
    <main className="main-layout">
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster timeout={3500} />
        
            <div className="permit-column">
              <DisplayPermits onSelect={setSelectedPermit} selectedId={selectedPermit?.id} />
            </div>

            <div className="activity-column">
              {selectedPermit ? (
                <ActivityCard permit={selectedPermit} />
              ) : (
                <p>Select a permit to see its activities.</p>
              )}
            </div>
            <div className='activity-table'>
              {selectedPermit && (<ShowActivityTable key= {selectedPermit.id }permitId={selectedPermit.id}></ShowActivityTable>)}
              
            </div>
        </ThemeProvider>
    </main>

    </>
  )
}

