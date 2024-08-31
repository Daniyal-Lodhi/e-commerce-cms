import toast from "react-hot-toast";
import { create } from "zustand";

interface useSafeMood{
    safeMood:boolean
    enableSafeMood:()=>void
    disableSafeMood:()=>void
}; 

export const useSafeMood = create<useSafeMood>((set)=>({
    safeMood:false,
    enableSafeMood:()=>{
        set({safeMood:true})
        toast.success("Safe mood is on")
    },
    disableSafeMood:()=>{
        set({safeMood:false})
        toast.success("Safe mood is off")

    },
}))