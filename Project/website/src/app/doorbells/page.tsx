import { getServerSession } from "next-auth"
// import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { api } from '@/trpc/server'
import { redirect } from "next/navigation";
// import { api } from '@/trpc/client'
import DoorbellCard from "@/components/doorbell/DoorbellCard";
import DoorbellList from "@/components/doorbell/DoorbellList";

export default async function DoorbellPage() {
  const session = await getServerSession(authOptions);
  // const session = useSession();
  // console.log(session)
  if (!session) {
    return redirect("/")
  }
  
  const doorbells = await api.doorbell.getUserDoorbells.query(session.user.id ?? "");

  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <div>
        <h1 className="text-5xl text-left font-semibold">Your Doorbells</h1>
      </div>
      {/* <p>{JSON.stringify(doorbells)}</p> */}
      <DoorbellList doorbells={doorbells}/>
    </main>
  )
}
