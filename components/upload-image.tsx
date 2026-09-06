'use client'

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ImagePlus, Trash, GripVertical } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface UploadImageProps {
    onChange: (imageUrls: string[]) => void;
    onRemove: (imageUrl: string) => void;
    disabled?: boolean;
    value: string[],
    allowMultiple?:boolean
}

const UploadImage: React.FC<UploadImageProps> = ({
    onChange,
    onRemove,
    disabled,
    value,
    allowMultiple = false
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const dragIndex = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const handleQueuesEnd = (result: any) => {
        const files = result?.info?.files ?? [];
        const orderedUrls: string[] = files
            .map((f: any) => f?.uploadInfo?.secure_url)
            .filter(Boolean);

        if (orderedUrls.length > 0) {
            onChange(orderedUrls);
        }
    }

    const handleDragStart = (index: number) => {
        dragIndex.current = index;
    };

    const handleDragEnter = (index: number) => {
        if (dragIndex.current === null || dragIndex.current === index) return;
        setDragOverIndex(index);
    };

    const handleDragEnd = () => {
        const from = dragIndex.current;
        const to = dragOverIndex;

        dragIndex.current = null;
        setDragOverIndex(null);

        if (from === null || to === null || from === to) return;

        const reordered = [...value];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(to, 0, moved);

        onChange(reordered); // full reordered list
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="flex gap-4 mb-4 items-center flex-wrap">
                {value.map((url, index) => (
                    <div
                        key={url}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragOver={(e) => {
                            e.preventDefault(); // allow dropping here
                        }}
                        onDrop={(e) => {
                            e.preventDefault();   // stop browser default action (e.g. opening/uploading the image)
                            e.stopPropagation();  // stop it bubbling to Cloudinary's global drop listener
                        }}
                        onDragEnd={handleDragEnd}
                        className={`h-[200px] w-[200px] relative rounded overflow-hidden border transition-opacity ${dragOverIndex === index ? "opacity-50 ring-2 ring-primary" : ""
                            }`}
                    >
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                size={'icon'}
                                variant={'destructive'}
                                onClick={() => onRemove(url)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Drag handle — grab here to reorder */}
                        {allowMultiple && <div className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing bg-black/50 rounded p-1">
                            <GripVertical className="h-4 w-4 text-white" />
                        </div>}

                        <Image
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            src={url}
                            className="object-cover pointer-events-none"
                            alt="Upload image"
                            fill
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget
                onQueuesEnd={handleQueuesEnd}
                uploadPreset="billboard"
                options={{ multiple: allowMultiple }}
            >
                {({ open }) => (
                    <Button
                        type="button"
                        variant={"secondary"}
                        disabled={disabled}
                        onClick={() => open()}
                    >
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Add Image
                    </Button>
                )}
            </CldUploadWidget>
        </div>
    )
}
export default UploadImage;