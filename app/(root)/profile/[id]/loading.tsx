export default function Loading() {
    return (
        <section className=''>
            <div className='flex flex-col w-full justify-start'>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20 object-cover">
                            <div className='rounded-full bg-gray-900/65 animate-pulse relative w-20 h-20' />
                        </div>

                        <div className="flex-1">
                            {/* <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2> */}
                            <div className='p-3.5 bg-gray-900/65 animate-pulse rounded-md min-w-52 my-2'/>
                            <div className='p-3.5 bg-gray-900/65 animate-pulse rounded-md min-w-52 my-2'/>
                            {/* <p className='text-base-medium text-gray-1'>@{username}</p> */}
                        </div>
                    </div>

                </div>
                {/* <p className='mt-6 max-w-xl text-base-regular text-light-2'>{bio}</p> */}
                <div className='py-24 px-3.5 mt-6 bg-gray-900/65 animate-pulse rounded-md max-w-xl my-2'/>

                <div className="mt-12 h-0.5 w-full bg-dark-3" />
            </div>
            <section className='mt-9 flex flex-col gap-10'>
                <article className='flex w-full flex-col rounded-xl'>
                    <div className="flex items-start justify-between">
                        <div className="flex w-full flex-1 flex-row gap-4">
                            <div className="flex flex-col items-center">
                                <div className='relative h-11 w-11'>
                                    <div />
                                </div>
                                
                            </div>

                            <div className="flex w-full flex-col">
                                <div className=''>
                                    {/* <h4 className='cursor-pointer text-base-semibold text-light-1'>{author.name}</h4> */}
                                    <div className='py-24 px-3.5 mt-6 bg-gray-900/65 animate-pulse rounded-md min-w-full flex-1 my-2'/>
                                    <div className='py-24 px-3.5 mt-6 bg-gray-900/65 animate-pulse rounded-md w-full flex-1 my-2'/>
                                    <div className='py-24 px-3.5 mt-6 bg-gray-900/65 animate-pulse rounded-md w-full flex-1 my-2'/>
                                </div>

                                {/* <p className='mt-2 text-small-regular text-light-2'>{content}</p> */}

                                <div className={"mt-5 flex flex-col gap-3"}>
                                    <div className="flex flex-row gap-3.5">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </section>
    )
} 