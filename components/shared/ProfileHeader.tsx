import Image from "next/image"

type Props = {
    accountId: string,
    authUserId: string,
    name: string,
    username: string,
    imgUrl: string,
    bio: string
}

export default function ProfileHeader({ accountId, authUserId, bio, imgUrl, name, username }: Props) 
{
    return (
        <div className='flex flex-col w-full justify-start'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20 object-cover">
                        <Image
                            src={imgUrl}
                            alt="Profile Image"
                            fill
                            className='rounded-full object-cover shadow-2xl' 
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                    </div>
                </div>

            </div>
            <p className='mt-6 max-w-xl text-base-regular text-light-2'>{bio}</p>

            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    )
}
