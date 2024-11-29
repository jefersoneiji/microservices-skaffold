import { Application } from 'jsr:@oak/oak/application'
import { Router } from 'jsr:@oak/oak/router'
import { crypto } from 'jsr:@std/crypto/crypto'
import { oakCors } from 'jsr:@tajpouria/cors'

const router = new Router()

type IComment = {
    [index: string]: Array<{ id: string, content: string }>
}

const commentsByPostId: IComment = {}

router.post('/posts/:id/comments', async (ctx) => {
    const id = crypto.randomUUID().toString().slice(0, 3)
    const { content } = await ctx.request.body.json() as unknown as { content: string, status: "approved" | 'rejected' | 'pending' }

    const comments = commentsByPostId[ctx.params.id] || []
    comments.push({ id, content })
    commentsByPostId[ctx.params.id] = comments

    await fetch('http://event-bus-service:8083/events', {
        method: 'POST',
        body: JSON.stringify({
            type: 'CommentCreated',
            data: {
                id,
                content,
                postId: ctx.params.id,
                status: 'pending'
            }
        })
    })

    ctx.response.body = comments
    ctx.response.status = 201
})

router.get('/posts/:id/comments', (ctx) => {
    ctx.response.body = commentsByPostId[ctx.params.id] || []
})

router.post('/events', async (ctx) => {
    const body = await ctx.request.body.json()
    console.log('Received Event: ', body.type)

    const { type, data } = body
    if (type === "CommentModerated") {
        const { postId, id, status, content } = data
        const comments = commentsByPostId[postId]

        const comment = comments.find(comment => {
            return comment.id === id;
        }) as unknown as { content: string, status: "approved" | 'rejected' | 'pending' }
        comment!.status = status

        await fetch('http://event-bus-service:8083/events', {
            method: 'POST',
            body: JSON.stringify({
                type: 'CommentUpdated',
                data: {
                    id,
                    content,
                    postId,
                    status
                }
            })
        })
    }
    ctx.response.body = "ok"
})

const app = new Application()
app.use(oakCors({ origin: "*" }))
app.use(router.routes())

console.info("posts server running on http://localhost:8081")
app.listen({ port: 8081 })