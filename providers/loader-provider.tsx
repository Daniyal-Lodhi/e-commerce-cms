'use client'

import { useLoading } from "@/hooks/use-loader";
import { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/ClipLoader";

const LoaderProvider = () => {
    const [mounted, setMounted] = useState(false);
    const { loading } = useLoading();
    useEffect(() => {
        setMounted(true);
    }, [])
    if (!mounted) {
        return null
    }
    return (
        <>
            {loading && <div className="fixed   inset-0 z-50 flex items-center justify-center bg-white">
                <PropagateLoader
                    className="text-black "
                    size={50}

                />
            </div>}
        </>
    );
}

export default LoaderProvider;
