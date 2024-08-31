'use client'

import { useStoreModal } from "@/hooks/use-store-modal";
import { Metadata } from "next";
import { useEffect } from "react";

export const revalidate = false ;


export default function Home() {
  
  const onOpen = useStoreModal((state)=>state.onOpen);
  const isOpen = useStoreModal((state)=>state.isOpen);
  useEffect(()=>{
    if(!isOpen){
      onOpen() ;
    }
  },[isOpen,onOpen]);
  
  
}