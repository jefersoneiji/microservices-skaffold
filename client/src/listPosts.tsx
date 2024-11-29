import { useQuery } from "@tanstack/react-query"
import { AddComment } from "./addComment"
import { ListComments } from "./listComments"

export const ListPosts = () => {

    const fetchPosts = async () => {
        const response = await fetch('http://posts.com/posts', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        const parsed = await response.json()
        return parsed
    }

    const { data, isLoading } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })

    if (isLoading) <h1>Loading...</h1>

    return (
        <div>
            <h1>Posts</h1>
            {isLoading === false && Object.values(data).map((elem: any) =>
                <div key={elem.id}>
                    <h3>{elem.title}</h3>
                    <AddComment id={elem.id}/>
                    <ListComments comments={elem.comments}/>
                </div>
            )}
        </div>
    )
}