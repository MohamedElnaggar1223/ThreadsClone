"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import UserThread from "../models/userThreads.model"
import { connectToDB } from "../mongoose"

type CreateThreadProps = {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: CreateThreadProps): Promise<void>
{
    connectToDB()
    
    try
    {
        const createdThread = await Thread.create({
            text,
            author,
            community: null
        })

        await UserThread.findByIdAndUpdate(author, { $push: { threads: createdThread._id } })
    }
    catch(e: any)
    {
        throw new Error(`error creating thread: ${e.message}`)
    }
    finally
    {
        revalidatePath(path)
    }
}

type ThreadProps = {
    _id: string,
    id: string,
    text: string,
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
    children: ThreadProps[] | null,
    likes: {
        _id: string
    }[]
}

type FetchThreadsProps = {
    posts: ThreadProps[],
    isNextPage: boolean
}

export async function fetchThreads(pageNumber = 1, pageSize = 20): Promise<FetchThreadsProps>
{
    connectToDB()

    try
    {
        const skipAmount = (pageNumber - 1) * pageSize

        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
                                    .sort({ createdAt: 'desc'})
                                    .skip(skipAmount)
                                    .limit(pageSize)
                                    .populate({
                                        path: 'author',
                                        model: UserThread,
                                    })
                                    .populate({
                                        path: 'children',
                                        populate: {
                                            path: 'author',
                                            model: UserThread,
                                            select: "_id name parentId image"
                                        }
                                    })
                                    .populate({
                                        path: 'likes',
                                        model: UserThread,
                                        select: "_id"
                                    })
        const totalPosts = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

        const posts = (await postsQuery.exec()) as ThreadProps[]

        const isNextPage = totalPosts > skipAmount + posts.length

        return { posts, isNextPage }
    }   
    catch(e: any)
    {
        throw new Error(`error fetching threads: ${e.message}`)
    }
}

export async function addLike({ id, path, userId }: { id: string, path: string, userId: string }): Promise<void>
{
    connectToDB()

    try
    {
        const thread = await Thread.findOne({ _id: id }).select('likes')

        if(thread.likes.find((like: string) => like.toString() === userId)) await Thread.findOneAndUpdate({ _id: id }, { $pull: { likes: userId } })
        else await Thread.findOneAndUpdate({ _id: id }, { $addToSet: { likes: userId } })

    }
    catch(e: any)
    {
        throw new Error(`error fetching threads: ${e.message}`)
    }
    finally
    {
        revalidatePath(path)
    }
}

export async function fetchThreadById(id: string): Promise<ThreadProps>
{
    connectToDB()

    try
    {
        const thread = await Thread.findById(id)
                                .populate({
                                    path: 'author',
                                    model: UserThread,
                                    select: "_id id name name image"
                                })
                                .populate({
                                    path: 'children',
                                    populate: [
                                        {
                                            path: 'author',
                                            model: UserThread,
                                            select: "_id name parentId image"
                                        },
                                        {
                                            path: 'children',
                                            model: Thread,
                                            populate: {
                                                path: 'author',
                                                model: UserThread,
                                                select: "_id id name parentId image"
                                            }
                                        }
                                    ]
                                }).exec() as ThreadProps

        return thread
    }
    catch(e: any)
    {
        throw new Error(`error fetching thread: ${e.message}`)
    }
}

export async function addCommentToThread({ threadId, commentText, userId, path }: { threadId: string, commentText: string, userId: string, path: string }): Promise<void>
{
    connectToDB()

    try
    {
        const originalThread = await Thread.findById(threadId)

        if(!originalThread) throw new Error("thread not found")

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        }) 

        const savedCommentThread = await commentThread.save()
        
        await UserThread.findByIdAndUpdate(userId, { $push: { threads: savedCommentThread._id } })

        originalThread.children.push(savedCommentThread._id)

        await originalThread.save()

        revalidatePath(path)
    }
    catch(e: any)
    {
        throw new Error(`error fetching thread: ${e.message}`)
    }
}
