import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() 
{
    const user = await currentUser()

    if(!user) redirect('/sign-in')

    const userInfo = await fetchUser(user?.id)

    if(userInfo?.onboarded) redirect('/')

    const userData = {
        id: user?.id || '',
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username || '',
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image: userInfo?.image || user?.imageUrl,
    }

    return (
        <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
            <div className='head-text'>Onboarding</div>
            <p className='mt-3 text-base-regular text-light-2'>Complete your profile now to use Threads!</p>
            <section className='mt-9 p-10 bg-dark-2'>
                <AccountProfile user={userData} btnTitle="Continue"/>
            </section>
        </main>
    )
}