import { getServerSession } from "next-auth"
// import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { api } from '@/trpc/server'
import { redirect } from "next/navigation";
import DoorbellPair from "@/components/doorbell/DoorbellPair";
// import { api } from '@/trpc/client'

export default async function DoorbellPairPage() {
  const session = await getServerSession(authOptions);
  // const session = useSession();
  // console.log(session)
  if (!session) {
    return redirect("/")
  }
  
  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <h1 className="text-5xl font-semibold">Add Doorbell</h1>
      <DoorbellPair session={session}/>
    </main>
  )
}
