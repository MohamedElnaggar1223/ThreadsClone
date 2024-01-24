"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function ViewButton({ id }: { id: string }) 
{
    const router = useRouter()

    return (
        <Button onClick={() => router.push(`/profile/${id}`)} className='user-card_btn'>
            View
        </Button>
    )
}
