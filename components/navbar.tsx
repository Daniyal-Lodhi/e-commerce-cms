import { UserButton } from "@clerk/nextjs"
import MainNav from "./mainNav"
import StoreSwitcher from "./store-switcher"
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { ModeToggle } from "./ui/theme-toggle-button";
export const Navbar = async ()=>{
    const {userId} = auth() ;
    if(!userId){
        redirect('/')
    }

    const stores = await prismadb.store.findMany({
        where:{
            userId,
        }
    }) ;

    return(
        <div className="flex flex-row items-center gap-x-3 sm:gap-0 justify-start border-b px-4 h-14 " >
            <div className="sm:mr-10"> 
                <StoreSwitcher items={stores}/>
            </div>
            <MainNav/>
            <div className="ml-auto flex items-center gap-x-3"  >
            <ModeToggle  />
            <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}