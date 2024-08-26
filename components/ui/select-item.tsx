'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

interface SelectDataItemProps{
    data:string[]
    setData: (value: string) => void
    latestYear?:string
    defSearchKey?:string
    title:string
}

export const SelectDataItem:React.FC<SelectDataItemProps> = ({
    data,
    setData,
    latestYear,
    defSearchKey,
    title
})=> {
    
  
  
  const [mounted,Setmounted] = useState(false);

    const handleChange = (selectedItem:string)=>{
      if(latestYear){
        setData(selectedItem)
      }
      else{
        if(selectedItem == 'product'){
        setData('products')
      }
      else if(selectedItem == 'Phone'){
        setData('phoneNumber')
      }
      else if(selectedItem == 'Completed'){
        setData('completed')
      }
      else if(selectedItem == 'Paid'){
        setData('paid')
      }
      console.log(defSearchKey)
      }
    }    


    useEffect(()=>{
        Setmounted(true);
    },[])

    if(!mounted)
        return null;

  return (
    <Select onValueChange={handleChange} defaultValue={ latestYear || defSearchKey }     >
      <SelectTrigger className="w-[130px]">
        <SelectValue  placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup  >
          <SelectLabel>{title}</SelectLabel>
          {
            data && data.map((item)=>(
                <SelectItem key={item} value={item}>{item}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
