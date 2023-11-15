"use client";
// import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]/route"
// import { api } from '@/trpc/server'
import { api } from '@/trpc/client'

export default function Home() {
  // const session = await getServerSession(authOptions);
  const session = useSession();
  // console.log(session)
  const users = api.getUsers.useQuery();
  const doorbells = api.getDoorbells.useQuery();
  const createDoorbell = api.createDoorbell.useMutation({
    onSuccess: () => {
      doorbells.refetch();
    }
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
      <p>{JSON.stringify(session)}</p>
      {/* <pre>{huh.status}</pre> */}
      <p>{JSON.stringify(users.data)}</p>
      <p>{JSON.stringify(doorbells.data)}</p>
      <button 
      onClick={async () => {
        createDoorbell.mutate()
        }} 
      className="btn btn-primary">create doorbell</button>
    </main>
  )
}
