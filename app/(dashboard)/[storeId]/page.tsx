import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";







export const Store = async (
    params: { storeId: string }
) => {
    const { userId } = auth();
    if (!userId) {
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId,
            id: params.storeId
        }
    })


    if (!store) {
        redirect('/');
    }
    return (
        <div>
            {"current store: " + store?.name}

        </div>
    )
}


export default Store;