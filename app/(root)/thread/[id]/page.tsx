import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) 
{
    if(!params.id) return notFound()

    const user = await currentUser()

    if(!user) return redirect('/sign-in')

    const userInfo = await fetchUser(user.id)

    const thread = await fetchThreadById(params.id)

    return (
        <section className='relative'>
            <div className="">
                <ThreadCard 
                    key={params.id}
                    id={params.id}
                    currentUserId={user.id}
                    parentId={thread?.parentId}
                    content={thread.text}
                    author={thread.author}
                    createdAt={thread.createdAt}
                    community={thread.community}
                    comments={thread.children}
                    likes={thread.likes}
                    currentUserObjectId={userInfo._id}
                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={userInfo._id.toString()}
                />
            </div>

            <div className="mt-10">
                {thread.children?.map((comment) => (
                    <ThreadCard 
                        key={comment.id}
                        id={comment.id}
                        currentUserId={user.id}
                        parentId={comment?.parentId}
                        content={comment.text}
                        author={comment.author}
                        createdAt={comment.createdAt}
                        community={comment.community}
                        comments={comment.children}
                        likes={comment.likes}
                        currentUserObjectId={userInfo._id}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}
