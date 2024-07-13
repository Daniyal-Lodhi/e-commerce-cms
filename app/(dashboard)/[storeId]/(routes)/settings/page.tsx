import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { SettingsFormPage } from "./components/settings-form";


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

    if(!store){
        redirect('/')
    }
    


    return(
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SettingsFormPage initialData={store} />

            </div>
            
        </div>
    )
}


export default settingPage ;