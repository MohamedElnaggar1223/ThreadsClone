import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Home() 
{
	const user = await currentUser()

    if(!user) redirect('/sign-in')

    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')

	const result = await fetchThreads(1, 30)

	return (
		<>
			<h1 className="head-text text-left">Home</h1>

			<section className="mt-9 flex flex-col gap-10">
				{result?.posts.length === 0 ? (
					<p>No threads found!</p>
				) : (
					result?.posts.map((post) => (
						<ThreadCard
							key={post._id}
							id={post._id}
							currentUserId={user.id}
							parentId={post?.parentId}
							content={post.text}
							author={post.author}
							createdAt={post.createdAt}
							community={post.community}
							comments={post.children}
							likes={post.likes}
							currentUserObjectId={userInfo._id}
						/>
					))
				)
				}
			</section>
		</>
	)
}