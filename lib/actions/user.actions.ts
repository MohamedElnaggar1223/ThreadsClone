"use server"

import { revalidatePath } from "next/cache"
import UserThread from "../models/userThreads.model"
import { connectToDB } from "../mongoose"
import { ThreadProps } from "./thread.actions"
import Thread from "../models/thread.model"

type UpdateUser = {
    userId: string, 
    username: string, 
    name: string, 
    bio: string, 
    image: string, 
    path: string
}

export async function updateUser({userId, username, name, bio, image, path}: UpdateUser): Promise<void>
{
    connectToDB()

    try
    {
        await UserThread.findOneAndUpdate(
            { id: userId }, 
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        )
    
        if(path === '/profile/edit')
        {
            revalidatePath(path)
        }
    }
    catch(e: any)
    {
        throw new Error(`Failed to create/update user: ${e.message}`)
    }
} 

type UserProps = {
    _id: string,
    id: string,
    username: string, 
    name: string, 
    bio: string, 
    image: string, 
    onboarded: boolean,
    threads: string[],
}

export async function fetchUser(userId: string): Promise<UserProps>
{
    connectToDB()

    try
    {
        const user = await UserThread
                            .findOne({ id: userId })
                            // .populate({
                            //     path: 'communities',
                            //     model: Community
                            // })
        return user
    }
    catch(e: any)
    {
        throw new Error(`Failed to fetch user: ${e.message}`)
    }
}

type UserThreadsProps = {
    _id: string,
    id: string,
    name: string,
    image: string, 
    threads: ThreadProps[]
}

export async function fetchUserPosts(userId: string): Promise<UserThreadsProps>
{
    try
    {
        connectToDB()

        // TODO: Populate Communities
        const threads = await UserThread.findOne({ id: userId }).populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: UserThread,
                    select: "_id id name image"
                }
            }
        }) as UserThreadsProps

        return threads
    }
    catch(e: any)
    {
        throw new Error(`Failed to fetch user posts: ${e.message}`)
    }
}