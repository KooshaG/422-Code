// "use client";

import { type Doorbell } from "@prisma/client";
import Link from "next/link";

interface DoorbellProps {
  doorbell: Doorbell
}

export default function DoorbellCard(props: DoorbellProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <img src="/doorbell.png" alt="Shoes" className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{props.doorbell.name}</h2>
        {
        props.doorbell.silentStart && props.doorbell.silentEnd &&
          <p>Silent between: {props.doorbell.silentStart?.toLocaleTimeString()} - {props.doorbell.silentEnd?.toLocaleTimeString()}</p>
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