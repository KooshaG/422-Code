// "use client";

import { type Doorbell } from "@prisma/client";
import Link from "next/link";

interface DoorbellProps {
  doorbell: Doorbell
}

export default async function DoorbellCard(props: DoorbellProps) {
  // gotta convert time strings to good time (xx:xx -> Date)
  var silentStart = null, silentEnd = null;
  if (props.doorbell.silentStart && props.doorbell.silentStart.split(':').length === 2) {
    const [hour, minute] = props.doorbell.silentStart.split(':').map(time => parseInt(time));
    silentStart = new Date(0,0,0,hour, minute);
  }
  if (props.doorbell.silentEnd && props.doorbell.silentEnd.split(':').length === 2) {
    const [hour, minute] = props.doorbell.silentEnd.split(':').map(time => parseInt(time));
    silentEnd = new Date(0,0,0,hour, minute);
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <img src="/doorbell.png" alt="Shoes" className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{props.doorbell.name === "Doorbell" ? `Doorbell ${props.doorbell.id}` : props.doorbell.name}</h2>
        {
        silentStart !== null && silentEnd !== null && 
          <p>Silent between: {silentStart.toLocaleTimeString([], {hour: "numeric", minute: "2-digit"})} - {silentEnd.toLocaleTimeString([], {hour: "numeric", minute: "2-digit"})}</p>
        }
        {
        silentStart === null && silentEnd === null &&
          <p>Quiet mode disabled</p>
        }
        <div className="card-actions">
          <Link href={`/doorbells/${props.doorbell.id}`}>
            <button className="btn btn-primary">View Doorbell</button>
          </Link>
        </div>
      </div>
    </div>
  )
  
}