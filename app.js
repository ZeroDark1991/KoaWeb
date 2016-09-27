'use strict'

const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const url = require('url')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const views = require('koa-views')
const session = require('koa-session')
const convert = require('koa-convert')

app.keys=['secret-zerodark1991']

app.use(convert(session(app)))

app.use(async (ctx, next) => {
    if(ctx.path == '/favicon.ico') return ctx.res.end()

    console.time(`${ctx.method}${ctx.url}`)
    ctx.type = 'text/html'
    await next() // 调用下一个middleware
    console.timeEnd(`${ctx.method}${ctx.url}`)
})

router.get('/set', async (ctx) => {
    let userId = ctx.cookies.get('userid',{signed:true})
    console.log(userId)
    if(!userId){
        ctx.body = 'can not get cookies'
    }else{
        ctx.body = userId
    }
})

router.get('/login', async (ctx) => {
    ctx.session.id = '111233333444'
    ctx.session.maxAge = 360000
    ctx.body = '登陆成功'
})

router.get('/logout', async (ctx) => {
    ctx.session = null
    ctx.body = '退出成功'
})

router.get('/', async (ctx) => {
    if(ctx.session.id){
        console.log(ctx.session.maxAge)
        await ctx.render('home')
    }else{
        ctx.redirect('/login')
        ctx.body = 'redirecting to login page'
    }
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