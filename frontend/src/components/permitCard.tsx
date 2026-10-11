import { type Permit } from '../types/permit'

function PermitCard({ permit, onSelect }: { permit: Permit, onSelect: (permit: Permit) => void }){

  return(
    <>
    {/* button, not div: clickable with keyboard too */}
    <button className="permit-card" onClick={() => onSelect(permit)}>
        <div className="post-modal-content">
            <h2>Permit Details</h2>
            <p>Permit ID: {permit.id}</p>
            <p>Permit Number: {permit.permitNo}</p>
            <p>Number of activities left: {permit._count.activities}</p>
            <p>Next activity: {new Date(permit.activities[0].activityDateTime).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</p>
        </div>
    </button>

    </>
  )
}

export default PermitCard
