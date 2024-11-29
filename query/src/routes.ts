import { Application } from 'jsr:@oak/oak/application'
import { Router } from 'jsr:@oak/oak/router'
import { oakCors } from 'jsr:@tajpouria/cors'

const router = new Router()

type IComment = { id: string, content: string, status: 'pending' | 'approved' | 'rejected' }

type IPost = {
    [index: string]: { id: string | "", title: string | "", comments: Array<IComment> },
}


const posts: IPost = {}

const handleEvent = (type: string, data: { id: string; title: string; content: string; postId: string; status: "pending" | "approved" | "rejected"; }) => {
    if (type === 'PostCreated') {
        const { id, title } = data

        posts[id] = { id, title, comments: [] }
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data

        const post = posts[postId]
        post.comments.push({ id, content, status })
    }

    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data
        console.log('comment status is: ', status, ' for comment: ', content)

        const post = posts[postId]
        const comment = post.comments.find(comment => {
            return comment.id === id
        })

        comment!.status = status
        comment!.content = content
    }
}

router.get('/posts', (ctx) => {
    ctx.response.body = posts
})


router.post('/events', async (ctx) => {
    const { type, data } = await ctx.request.body.json()

    handleEvent(type, data)

    ctx.response.body = "ok"
})


const app = new Application()
app.use(oakCors({ origin: "*" }))
app.use(router.routes())

console.info("posts server running on http://localhost:8082")
app.listen({ port: 8082 })

const pendingEvents = async () => {
    const res = await fetch('http://event-bus-service:8083/events', { method: 'GET' })

    for(let event of await res.json()){
        console.log('Processing event: ', event.type)

        handleEvent(event.type, event.data)
    }
}

pendingEvents()