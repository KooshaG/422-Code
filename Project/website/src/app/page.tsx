'use client';
// import { getServerSession } from "next-auth"
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]/route"
// import { api } from '@/trpc/server'
import { api } from '@/trpc/client'

export default function Home() {
  // const session = await getServerSession(authOptions);
  const session = useSession();
  // console.log(session)
  const huh = api.getUsers.useQuery();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{JSON.stringify(session)}</p>
      <br></br>
      <pre>{huh.status}</pre>
      <p>{JSON.stringify(huh.data)}</p>
    </main>
  )
}
