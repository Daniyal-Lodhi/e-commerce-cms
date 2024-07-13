import React from "react"

interface headingProps {
    title: String,
    description: String,
}

export const Heading: React.FC<headingProps> = ({
    title,
    description
}) => {


    return (
        <div>
            <div className="text-3xl font-bold tracking-tight">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
        </div>
    )
}