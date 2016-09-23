const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const url = require('url')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const views = require('koa-views')

app.use(async (ctx, next) => {
    console.time(`${ctx.method}${ctx.url}`)
    ctx.type = 'text/html'
    await next() // 调用下一个middleware
    console.timeEnd(`${ctx.method}${ctx.url}`)
})

router.get('/', async (ctx) => {
    await ctx.render('home')
})

router.post('/signin', async (ctx) => {
    let body = ctx.request.body
    if(body.name === 'koa' && body.password === '111')
        ctx.body = `<h1>Login Success</h1>`
    else
        ctx.body = `<h1>Login Failed</h1>`
})

router.get('/users/:name', async (ctx) => {
	let query = url.parse(ctx.url).query
	ctx.body = `<h1>${ctx.params.name}<br />${query}</h1>`
})

app.use(bodyParser())

app.use(views(path.join(__dirname,'views'),{extension: 'jade'}))

app.use(router.routes())

app.use(async (ctx) => {
	ctx.status = 404
	ctx.body = `Not Found!`
})

app.listen(3000, '127.0.0.1')
console.log('app listening at 127.0.0.1:3000')