"use server"

import { revalidatePath } from "next/cache"
import UserThread from "../models/userThreads.model"
import { connectToDB } from "../mongoose"
import { ThreadProps } from "./thread.actions"
import Thread from "../models/thread.model"
import { SortOrder } from "mongoose"
import { FilterQuery } from "mongoose"

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

type UsersFetched = {
    users: UserProps[],
    isNext: boolean
}

export async function fetchUsers({ userId, searchString = "", pageNumber = 1, pageSize = 20, sortBy = 'desc' }: { userId: string, searchString?: string, pageNumber?: number, pageSize?: number, sortBy?: SortOrder }): Promise<UsersFetched>
{
    try
    {
        connectToDB()

        const skipAmout = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof UserThread> = {
            id: { $ne: userId },
        }

        if(searchString.trim() !== "")
        {
            query.$or = [
                {
                    username: { $regex: regex}
                },
                {
                    name: { $regex: regex}
                }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = UserThread.find(query)
            .sort(sortOptions)
            .skip(skipAmout)
            .limit(pageSize)

        const totalUsersQuery = await UserThread.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsersQuery > (pageNumber * pageSize)

        return { users, isNext }
    }
    catch(e: any)
    {
        throw new Error(`Failed to fetch users: ${e.message}`)
    }
}

export async function getActivity(userId: string): Promise<ThreadProps[]>
{
    try
    {
        connectToDB()

        const userThreads = await Thread.find({ author: userId })

        const childThreadsIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({ 
            _id: { $in: childThreadsIds }, 
            author: { $ne: userId } 
        })
        .populate({
            path: 'author',
            model: UserThread,
            select: "_id name image"
        }) as ThreadProps[]

        return replies
    }
    catch(e: any)
    {
        throw new Error(`Failed to fetch activity: ${e.message}`)
    }
}