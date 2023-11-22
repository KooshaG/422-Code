import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import NavbarCenterButtons from "./NavbarCenterButtons";
import SignInOutButton from "../button/SignInOutButton";


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

export default async function NavBar() {
  const session = await getServerSession(authOptions);

  return (
    <div className={`${session ? "join join-vertical" : ""} w-full`}>
      <div className={`navbar ${session ? "join-item" : ""} bg-base-100 drop-shadow`}>
        <div className='navbar-start'>
          <Link href='/' className='btn btn-ghost normal-case text-xl font-bold hidden md:inline-flex'>
          Any Bell
          </Link>
          <div className="dropdown md:hidden">
            <label tabIndex={0} className="btn btn-ghost m-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5h16Zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3h16Zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3h16Z"/></g></svg>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/">Any Bell</Link></li>
              {session && navLinks.map(link => <li key={link.nav}><Link href={link.nav}>{link.name}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className='navbar-center'>
          <NavbarCenterButtons session={session}/>
        </div>
        <div className='navbar-end'>
          <SignInOutButton session={session} />
        </div>
      </div>
    </div>

  );
}
