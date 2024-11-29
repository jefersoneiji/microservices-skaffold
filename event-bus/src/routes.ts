import { Context } from "jsr:@oak/oak@^16.1.0/context";
import { Application } from 'jsr:@oak/oak/application'
import { Router } from 'jsr:@oak/oak/router'
import { oakCors } from 'jsr:@tajpouria/cors'

const router = new Router()

const events: any = []

router.post('/events', async (ctx) => {
    const event = await ctx.request.body.json()

    events.push(event)

    await fetch('http://posts-clusterip-service:8080/events', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event) as any
    })
    
    await fetch('http://comments-service:8081/events', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event) as any
    })
    
    fetch('http://query-service:8082/events', {
        method: 'POST',
        body: JSON.stringify(event) as any
    }).catch(()=>{console.error('handled query error')})
   
    fetch('http://moderation-service:8084/events', {
        method: 'POST',
        body: JSON.stringify(event) as any
    }).catch(()=>{console.error('handled query error')})

    ctx.response.body = "ok"
})

router.get('/events', (ctx) => {
    ctx.response.body = events
})

const app = new Application()
app.use(oakCors({ origin: "*" }))
app.use(router.routes())

console.info("posts server running on http://localhost:8083")
app.listen({ port: 8083 })