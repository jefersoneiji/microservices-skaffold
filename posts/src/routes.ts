import { Application } from 'jsr:@oak/oak/application'
import { Router } from 'jsr:@oak/oak/router'
import { crypto } from 'jsr:@std/crypto/crypto'
import { oakCors } from 'jsr:@tajpouria/cors'

const router = new Router()

type IPost = {
    [index: string]: { id: string | "", title: string | "" },
}

const posts: IPost = {}

router.post('/posts/create', async (ctx) => {
    const id = crypto.randomUUID().toString().slice(0, 3)
    const { title } = await ctx.request.body.json() as unknown as { title: string }

    posts[id] = { id, title }

    await fetch('http://event-bus-service:8083/events', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'PostCreated', data: { id, title } })
    })

    ctx.response.status = 201
    ctx.response.body = posts[id]
})

router.get('/posts', (ctx) => {
    ctx.response.body = posts
})

router.post('/events', async (ctx) => {
    const body = await ctx.request.body.json()
    console.log('Received Event: ', body.type)

    ctx.response.body = "ok"
})

const app = new Application()
app.use(oakCors({ origin: "*" }))
app.use(router.routes())

console.info("posts server running on http://localhost:8080")
console.log('HELLO WORLD!')
app.listen({ port: 8080 })
