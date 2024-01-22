"use client"

import { addLike } from "@/lib/actions/thread.actions"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useOptimistic, startTransition  } from "react"

export default function ThreadLike({ id, likes, userId }: { id: string, likes: string[], userId: string }) 
{
    const [optimisticLikes, addOptimisticLikes] = useOptimistic(
        likes,
        (state, newLike: string) => {
            return state.includes(userId) ? state.slice().filter(like => like !== userId) : [...state, newLike]
        }
    )

    const pathname = usePathname()

    return (
        <div 
            onClick={async () => {
                startTransition (() => 
                    addOptimisticLikes(userId)
                )
                await addLike({ id, path: pathname, userId })
            }} 
            className="flex flex-row gap-x-1 items-center"
        >
            {
                optimisticLikes.includes(userId) ?
                <Image
                    src='/assets/heart-filled.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain' 
                />
                :
                <Image
                    src='/assets/heart-gray.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain' 
                />
            }
            <p className='text-[12px] text-light-2'>{optimisticLikes.length}</p>
        </div>
    )
}
