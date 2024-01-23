import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"

type Props = {
    currentUserId: string,
    accountId: string,
    accountType: string
}

export default async function ThreadsTab({ currentUserId, accountId, accountType }: Props) 
{
    const result = await fetchUserPosts(accountId)

    if(!result) redirect('/')

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.threads.map((thread) => (
                <ThreadCard 
                    key={thread.id}
                    id={thread.id} 
                    currentUserId={currentUserId} 
                    content={thread.text} 
                    author={ accountType === 'User' ? { id: result.id, name: result.name, image: result.image } : thread.author} 
                    community={null} 
                    createdAt={thread.createdAt}
                    parentId={thread.parentId} 
                    comments={thread.children} 
                    likes={thread.likes}
                    currentUserObjectId={result._id.toString()}
                />
            ))}
        </section>
    )
}
