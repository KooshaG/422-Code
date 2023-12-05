import { getServerSession } from "next-auth"
// import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { api } from '@/trpc/server'
import Link from "next/link";
// import { api } from '@/trpc/client'

const navLinks = [
  {
    nav: "/doorbells",
    name: "Your Doorbells",
  }, 
  {
    nav: "/add",
    name: "Add Doorbell",
  },
  {
    nav: "/test",
    name: "Test",
  }, 
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const session = useSession();
  // console.log(session)
  const users = await api.user.getAll.query();
  const doorbells = await api.doorbell.getUserDoorbells.query();



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
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <div>
        <p className="text-5xl">Hello {session ? session.user.name : ""}!</p>
        <p className="text-3xl">Press any of the buttons to start using Any Bell</p>
      </div>
      <div className="flex flex-col w-full md:w-96 gap-4">
        {navLinks.map((navLink) => <Link href={navLink.nav} key={navLink.nav} className="btn btn-secondary">{navLink.name}</Link>)}
      </div>
    </main>
  )
}
