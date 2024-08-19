'use client'
import { useEffect, useState } from "react"


const formatter =new Intl.NumberFormat("en-Us",{
    style:'currency',
    currency:"PKR"
})


const Currency = ({value}:{value:string | Number}) => {

    const [mounted,setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
    })

    if(!mounted){
        return null;
    }


  return (
    <div>
      {formatter.format(Number(value))}
    </div>
  )
}

export default Currency
