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

interface SelectDataItemProps {
  data: string[]
  setData: (value: string) => void
  latestYear?: string
  searchKeySelect?: string
  title: string
}

export const SelectDataItem: React.FC<SelectDataItemProps> = ({
  data,
  setData,
  latestYear,
  searchKeySelect,
  title
}) => {



  const [mounted, Setmounted] = useState(false);



  const handleChange = (selectedItem: string) => {
    if (latestYear) {
      setData(selectedItem)
    }
    else {
      if (selectedItem == 'products') {
        setData('products')
      }
        if (selectedItem == 'phone') {
          setData('phoneNumber')
        }
        // console.log(searchKeySelect)
      }
    
  }


  useEffect(() => {
    Setmounted(true);
  }, [])

  if (!mounted)
    return null;

  return (
    <Select onValueChange={handleChange} defaultValue={latestYear || searchKeySelect}     >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup  >
          <SelectLabel>{title}</SelectLabel>
          {
            data && data.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
