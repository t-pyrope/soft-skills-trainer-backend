const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const { v4: uuid } = require('uuid');

const { categoryList, createCategory } = require('./controllers/categories');
const { createTask, getTasks } = require('./controllers/tasks');
const { login, logout } = require('./controllers/login');
const { registerTest } = require('./controllers/register');
const { oauth, oauthCallback } = require('./controllers/oauth');
const { me } = require('./controllers/me');

const Session = require('./models/Session');

const mustBeAuthenticated = require('./libs/mustBeAuthenticated');

const app = new Koa();
app.use(require('koa-bodyparser')());
app.use(cors());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        if (e.status) {
            ctx.status = e.status;
            ctx.body = { error: e.message }
        } else {
            console.error(e);
            ctx.status = 500;
            ctx.body = { error: 'Internal server error' };
        }
    }
})

app.use((ctx, next) => {
    ctx.login = async function (user) {
        const token = uuid();

        const session = new Session({
            token,
            user,
            lastVisit: new Date(),
        })

        await session.save();

        return token;
    }

    return next();
})

const router = new Router({ prefix: '/api' });

router.use(async (ctx, next) => {
    const header = ctx.request.get('Authorization');
    if (!header) return next();

    const token = header.split(' ')[1];
    const session = await Session
        .findOneAndUpdate({ token }, { lastVisit: new Date() })
        .populate('user');

    if (!session) {
        ctx.throw(401, 'Uncorrect token')
    } else {
        ctx.user = session.user;
    }

    return next();
})

router.post('/login', login);
router.post('/registerTest', registerTest);
router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', oauthCallback);
router.post('/logout', mustBeAuthenticated, logout)

router.get('/me', mustBeAuthenticated, me);

router.get('/categories', categoryList);
router.post('/category', createCategory);

router.get('/tasks', getTasks);
router.post('/task', mustBeAuthenticated, createTask);

app.use(router.routes());

module.exports = app;
