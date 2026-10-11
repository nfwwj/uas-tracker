import { useEffect, useState } from 'react'
import DisplayPermits from './components/displayPermits'
import ActivityCard from './components/activityCard'
import { type Permit } from './types/permit'

export default function App() {
  const [refreshKey, setrefreshKey] = useState<number>(0)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)

  return(
    <>
    <div className="main-layout">
        <div className="permit-column">
          <DisplayPermits refreshKey={refreshKey} onSelect={setSelectedPermit} />
        </div>
        <div className="activity-column">
          {selectedPermit ? (
            <ActivityCard permit={selectedPermit} />
          ) : (
            <p>Select a permit to see its activities.</p>
          )}
        </div>
      </div>

    </>
  )
}








export function App2(){
  const [refreshKey, setrefreshKey] = useState<number>(0)
  const triggerRefresh = () => (setrefreshKey(prev => prev + 1))
  const [permit, setPermit] = useState<null | Permit>(null)
  return(
    <>
    <DisplayPermits refreshKey={refreshKey}  />

    
    
    </>
  )

}