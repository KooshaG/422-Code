import { getServerSession } from "next-auth"
// import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { api } from '@/trpc/server'
// import { api } from '@/trpc/client'

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const session = useSession();
  // console.log(session)
  const users = await api.getUsers.query();
  const doorbells = await api.getDoorbells.query();



  if (!session) {
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
        <p className="text-5xl">Hello {session ? session.user.name : ""}!</p>
      </div>
      <p>{JSON.stringify(session)}</p>
      {/* <pre>{huh.status}</pre> */}
      <p>{JSON.stringify(users)}</p>
      <p>{JSON.stringify(doorbells)}</p>
    </main>
  )
}
