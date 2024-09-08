import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { useEffect } from "react";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismadb.store.findFirst({
    where: { userId }
  });

  if (store) {
    redirect(`/${store.id}`)
  }

  useEffect(()=>{

  },[])



  return (
    <>


      {children}
    </>
  );
}
