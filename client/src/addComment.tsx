import { useMutation } from "@tanstack/react-query"
import { ChangeEvent, FormEvent, useState } from "react"

export const AddComment = ({ id }: { id: string }) => {
    const addComment = async (event: { content: string }) => {
        return await fetch(`http://posts.com/posts/${id}/comments`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
    }
    const mutation = useMutation({ mutationFn: addComment })

    const [comment, setComment] = useState('')
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setComment(e.target.value)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutation.mutate({ content:comment })
        
        setComment('')
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <label htmlFor="addComment">Add Comment: </label>
            <input type="text" id="addComment" name="addComment" onChange={handleChange} /><br /><br />
            <input type="submit" value="Submit" />
        </form>
    </>)
}