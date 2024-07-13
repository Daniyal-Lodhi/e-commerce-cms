import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Admin dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const {userId} = auth() ;
    if(!userId){
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where:{userId}
    });

    if(store){
      redirect(`/${store.id}`)
    }

  return (
   <>
   layout for root group
   {children}
   </>
  );
}
