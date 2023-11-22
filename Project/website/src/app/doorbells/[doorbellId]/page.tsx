import { getServerSession } from "next-auth"
// import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { api } from '@/trpc/server'
import { redirect } from "next/navigation";
// import { api } from '@/trpc/client'
import DoorbellEditForm from "@/components/doorbell/DoorbellEditForm";
import DoorbellLogs from "@/components/doorbell/DoorbellLogs";



export default async function DoorbellIdPage({
  params,
}: {
  params: { doorbellId: string }
}) {
  const session = await getServerSession(authOptions);
  const doorbell = await api.doorbell.get.query({doorbellId: parseInt(params.doorbellId), userId: session?.user.id || ""})
  // const session = useSession();
  // console.log(session)
  if (!session || !doorbell) {
    return redirect("/")
  }
  


  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <h1 className="text-5xl font-semibold">Edit Doorbell</h1>
      <DoorbellEditForm session={session} doorbell={doorbell}/>
      <div className="divider"></div> 
      <h1 className="text-5xl font-semibold">Doorbell Events</h1>
      {/* <p>{JSON.stringify(doorbell)}</p> */}
      <DoorbellLogs logs={doorbell.logs}/>
    </main>
  )
}
