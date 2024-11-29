import { Application } from 'jsr:@oak/oak/application'
import { Router } from 'jsr:@oak/oak/router'

const router = new Router()

router.post('/events', async (ctx) => {
    const event = await ctx.request.body.json()
    const { type, data } = event

    if (type === "CommentCreated") {
        const status = data.content.includes('orange') ? 'rejected' : 'approved'


        await fetch('http://event-bus-service:8083/events', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    content: data.content,
                    status
                }
            }) as any
        })

    }

    ctx.response.body = "ok"
})


const app = new Application()
app.use(router.routes())

console.info("posts server running on http://localhost:8084")
app.listen({ port: 8084 })