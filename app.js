const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

const { categoryList, createCategory } = require('./controllers/categories');
const { createTask, getTasks } = require('./controllers/tasks');
const { login } = require('./controllers/login');
const { registerTest } = require('./controllers/register');

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

const router = new Router({ prefix: '/api' });

router.post('/login', login);
router.post('/registerTest', registerTest);

router.get('/categories', categoryList);
router.post('/category', createCategory);

router.get('/tasks', getTasks);
router.post('/task', createTask);

app.use(router.routes());

module.exports = app;
