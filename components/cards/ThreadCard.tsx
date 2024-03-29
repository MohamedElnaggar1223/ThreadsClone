import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ThreadLike from '../threadEmotes/ThreadLike'
import { cn } from '@/lib/utils'

type ThreadCardProps = {
    id: string,
    currentUserId: string,
    content: string,
    author: {
        name: string,
        image: string,
        id: string
    },
    community: {
        name: string,
        id: string,
        image: string
    } | null,
    createdAt: string,
    parentId: string | null,
    comments: {
        author: {
            image: string,
        }
    }[] | null,
    isComment?: boolean,
    likes: {
        _id: string,
    }[],
    currentUserObjectId: string
}

export default function ThreadCard({ id, currentUserId, content, author, createdAt, parentId, comments, community, isComment, likes, currentUserObjectId }: ThreadCardProps) 
{
    const transformedLikes = likes.map(like => like._id.toString())

    return (
        <article className={cn('flex w-full flex-col rounded-xl', isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7')}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
                            <Image
                                src={author.image}
                                alt="Profile Image"
                                fill
                                className='rounded-full cursor-pointer' 
                            />
                        </Link>
                        <div className='thread-card_bar' />
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>{author.name}</h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-light-2'>{content}</p>

                        <div className={cn("mt-5 flex flex-col gap-3", isComment && 'mb-10')}>
                            <div className="flex flex-row gap-3.5">
                                <ThreadLike id={id.toString()} userId={currentUserObjectId.toString()} likes={transformedLikes} />
                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src='/assets/reply.svg'
                                        alt='reply'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer object-contain' 
                                    />
                                </Link>
                                <Image
                                    src='/assets/repost.svg'
                                    alt='repost'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain' 
                                />
                                <Image
                                    src='/assets/share.svg'
                                    alt='share'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain' 
                                />
                            </div>

                            {
                                isComment && comments && comments?.length > 0 && (
                                    <Link href={`/threads/${id}`}>
                                        <p className='mt-1 text-subtle-medium cursor-pointer text-gray-1'>{comments.length} replies</p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
