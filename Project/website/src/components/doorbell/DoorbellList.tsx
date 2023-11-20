// "use client";

import { type Doorbell } from "@prisma/client";
import DoorbellCard from "./DoorbellCard";

interface DoorbellProps {
  doorbells: Doorbell[]
}

export default function DoorbellList(props: DoorbellProps) {
  return (
    <div className="flex flex-wrap gap-8 justify-center py-8">
      {props.doorbells.map((doorbell) => <DoorbellCard key={doorbell.name} doorbell={doorbell}/>)}
    </div>
  )
  
}