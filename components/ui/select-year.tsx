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

interface SelectYearProps{
    years:string[]
    setDataYear: (value: string) => void
    latestYear:string
}

export const SelectYear:React.FC<SelectYearProps> = ({
    years,
    setDataYear,
    latestYear,
})=> {

    const [mounted,Setmounted] = useState(false);

    useEffect(()=>{
        Setmounted(true);
    },[])

    if(!mounted)
        return null;




    const handleChange = (year:string)=>{
        setDataYear(year)
    }
  return (
    <Select onValueChange={handleChange} defaultValue={latestYear} >
      <SelectTrigger className="w-[130px]">
        <SelectValue  placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup  >
          <SelectLabel>Years</SelectLabel>
          {
            years && years.map((year)=>(
                <SelectItem key={year} value={year}>{year}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
