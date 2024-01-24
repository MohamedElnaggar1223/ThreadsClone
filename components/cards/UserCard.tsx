import Image from "next/image"
import ViewButton from "./ViewButton"

type Props = {
    id: string,
    name: string,
    username: string,
    imgUrl: string,
    personType: string
}

export default function UserCard({ id, name, username, imgUrl, personType }: Props) 
{
    return (
        <article className='user-card'>
            <div className="user-card_avatar">
                <Image
                    src={imgUrl}
                    alt={name}
                    width={48}
                    height={48}
                    className='rounded-full' 
                />

                <div className="flex-1 text-ellipsis">
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>
            
            <ViewButton
                id={id}
            />
        </article>
    )
}
