'use client'

import { MagicSpinner } from "react-spinners-kit";

const LoaderProvider = () => {
    return (

        <div className="overflow-hidden" >
            <div className=" fixed   inset-0 overflow-hidden z-50 ">
                <div className=" flex h-full w-full items-center justify-center" >
                    <MagicSpinner size={40} color="black" />
                </div>
            </div>
        </div>

    );
}

export default LoaderProvider;
