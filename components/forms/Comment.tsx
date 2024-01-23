"use client"

import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "../ui/input"
import Image from "next/image"
import { CommentValidation } from "@/lib/validations/thread"
import { addCommentToThread } from "@/lib/actions/thread.actions"

type Props = {
    threadId: string,
    currentUserImg: string,
    currentUserId: string
}

export default function Comment({ threadId, currentUserImg, currentUserId }: Props) 
{
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread({
            commentText: values.thread,
            userId: currentUserId.toString(),
            path: pathname,
            threadId: threadId
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
            <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-3 w-full'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt="Profile Image"
                                    width={48}
                                    height={48}
                                    className='rounded-full cursor-pointer object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    placeholder='Comment...'
                                    className='text-light-1 outline-none no-focus'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='comment-form_btn'>Reply</Button>
            </form>
        </Form>
    )
}
