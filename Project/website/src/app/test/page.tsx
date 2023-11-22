"use client";
// import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { api } from '@/trpc/server'
import { api } from '@/trpc/client'
import { useState } from "react";

export default function Home() {
  // const session = await getServerSession(authOptions);
  const session = useSession();
  // console.log(session)

  const [ringDoorbellId, setRingDoorbellId] = useState<number>(0)
  const [pairDoorbellCode, setPairDoorbellCode] = useState<number>(0)
  const [getDoorbellId, setGetDoorbellId] = useState<number>(0)

  // const users = api.user.getAll.useQuery();
  const doorbells = api.doorbell.getUserDoorbells.useQuery();
  const createDoorbell = api.doorbell.create.useMutation({
    onSuccess: () => {
      doorbells.refetch();
    }
  });
  const ringDoorbell = api.doorbell.ring.useMutation()
  const pairDoorbell = api.doorbell.pair.useMutation({
    onSuccess: () => {
      doorbells.refetch();
    },
    onError: (error, variables, context) => {
    
      console.log("error", error)
    },
  });
  const getDoorbellLogs = api.doorbell.getLogs.useQuery(getDoorbellId, {
    enabled: false,
  });
  

  if (session.status === "loading")
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <span className="loading loading-dots loading-lg"></span>
      </main> 
      )


  if (session.status === "unauthenticated") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          <p className="text-5xl">Welcome to Any Bell!</p>
          <p className="text-xl">Please login to use the service.</p>
        </div>
      </main>
      )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p className="text-5xl">Hello {session.status === "authenticated" ? session.data?.user.name : ""}!</p>
      </div>
      <div className="flex flex-col space-y-3 items-center" id="create-doorbell">
        <p>{JSON.stringify(doorbells.data)}</p>
        <button 
        onClick={async () => {
          createDoorbell.mutate()
          }} 
        className="btn btn-neutral">
          create doorbell
        </button>
      </div>

      <div className="flex flex-col space-y-3 items-center" id="ring-doorbell">
        <input type="number" value={ringDoorbellId} onChange={(e) => setRingDoorbellId(parseInt(e.target.value))} placeholder="Doorbell Id" className="input input-bordered w-full max-w-xs" />
        <button 
        onClick={async () => {
          ringDoorbell.mutate(ringDoorbellId)
          }} 
        className="btn btn-neutral">
          Ring Doorbell
        </button>
      </div>

      <div className="flex flex-col space-y-3 items-center" id="pair-doorbell">
      <input type="number" value={pairDoorbellCode} onChange={(e) => setPairDoorbellCode(parseInt(e.target.value))} placeholder="Doorbell Id" className="input input-bordered w-full max-w-xs" />
        <button 
        onClick={async () => {
          pairDoorbell.mutate({registrationCode: pairDoorbellCode, userId: session.data?.user.id ?? ""})
          }} 
        className="btn btn-neutral">
          Pair doorbell to user
        </button>
      </div>

      <div className="flex flex-col space-y-3 items-center" id="get-doorbell-logs">
        <p>{JSON.stringify(getDoorbellLogs.data)}</p>
        <input type="number" value={getDoorbellId} onChange={(e) => setGetDoorbellId(parseInt(e.target.value))} placeholder="Doorbell Id" className="input input-bordered w-full max-w-xs" />
        <button 
        onClick={async () => {
          getDoorbellLogs.refetch()
          }} 
        className="btn btn-neutral">
          Get doorbell logs
        </button>
      </div>
      
    </main>
  )
}
