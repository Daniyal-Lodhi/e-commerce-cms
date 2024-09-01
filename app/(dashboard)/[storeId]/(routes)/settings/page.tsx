import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { SettingsFormPage } from "./components/settings-form";
import { Metadata } from "next";


export const metadata:Metadata = {
    title: 'Settings',
  }

interface settingsPageProps {
    params:{
        storeId:string 
    }
}

const settingPage : React.FC<settingsPageProps> = async ({
    params
})=>{
    const {userId} = auth() ;

    if(!userId){
        redirect('/sign-in')
    }
    const store = await prismadb.store.findFirst({
        where:{
            userId,
            id:params.storeId
        }
    })
    const storeJson = JSON.parse(JSON.stringify(store)) ;
console.log(storeJson)

    if(!store){
        redirect('/')
    }
    


    return(
        <div className="flex-col">
            <div className="flex-1 sm:p-8 p-4 pt-6 space-y-4">
                { store && <SettingsFormPage initialData={store}  />}

            </div>
            
        </div>
    )
}


export default settingPage ;