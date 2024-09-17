'use client'

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ImagePlus, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface UploadImageProps {
    onChange: (imageUrl: string) => void;
    onRemove: (imageUrl: string) => void;
    disabled?: boolean;
    value: string[]
}

const UploadImage: React.FC<UploadImageProps> = ({
    onChange,
    onRemove,
    disabled,
    value
}) => {
    const [isMounted, setIsMounted] = useState(false);
    // use effect will only work when this component runs in client side 

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
        // console.log(result.info.secure_url   )
    }
    if (!isMounted) {
        return null;
    }
    return (
        <div>
            <div className="flex gap-4 mb-4 items-center">
                {
                    value.map((url) => (
                        <div key={url} className="h-[200px] w-[200px] relative rounded overflow-hidden">
                            <div className="absolute top-2 right-2 z-10">
                                <Button
                                    type="button"
                                    size={'icon'}
                                    variant={'destructive'}
                                    onClick={() => onRemove(url)}>
                                    <Trash className="h-4 w-4" />
                                </Button>


                            </div>
                            <Image
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                src={url}
                                className="object-cover"
                                alt="Upload image"
                                fill
                            />
                        </div>
                    ))}
            </div>
            <CldUploadWidget onSuccess={(result) => {
                onUpload(result);
            }} uploadPreset="billboard" >
                {
                    ({ open }) => {
                        const onClick = () => {
                            open();
                        }
                        return (
                            <Button
                                type="button"
                                variant={"secondary"}
                                disabled={disabled}
                                onClick={onClick}
                            >
                                <ImagePlus className="w-4 h-4 mr-2" />
                                Add Image
                            </Button>
                        )
                    }
                }
            </CldUploadWidget>
        </div>
    )
}
export default UploadImage;