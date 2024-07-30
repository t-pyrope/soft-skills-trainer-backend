const { nanoid } = require('nanoid');

const Task = require('../models/Task');
const Category = require('../models/Category');

const taskMapper = require('../mappers/task');

module.exports.createTask = async function createTask(ctx, next){
    const category = await Category.findOne({ id: ctx.request.body.categoryId });
    const imgId = ctx.request.body.imgId;
    const src = `https://images.pexels.com/photos/${imgId}/pexels-photo-${imgId}.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280`

    const task = await Task.create({
        src,
        text: ctx.request.body.text,
        id: nanoid(),
        category: category._id,
    })

    await task.save();

    ctx.body = { task: taskMapper(task) };
}

module.exports.getTasks = async function getTasks (ctx, next) {
    const category = await Category.findOne({ id: ctx.query.categoryId });
    const tasks = await Task.find({ category: category._id });

    ctx.body = { tasks: tasks.map(taskMapper) };
}
