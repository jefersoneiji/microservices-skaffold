import { useMutation } from "@tanstack/react-query"
import { ChangeEvent, FormEvent, useState } from "react"

export const AddPost = () => {

    const addPost = async (event: { title: string }) => {
        console.log('event from addPost is: ', event)
        return await fetch('http://posts.com/posts/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
    }
    const mutation = useMutation({ mutationFn: addPost })

    const [title, setTitle] = useState('')
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutation.mutate({ title })

        setTitle('')
    }

    return (
        <>
            <div>
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fname">Title: </label>
                    <input type="text" id="fname" name="fname" onChange={handleChange} /><br /><br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    )
}