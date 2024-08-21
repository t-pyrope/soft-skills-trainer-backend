const userMapper = require("../mappers/user");
const Task = require('../models/Task');

module.exports.me = async function me (ctx, next) {
    ctx.body = userMapper(ctx.user);
}

module.exports.toggleTaskDone = async function toggleTaskDone (ctx, next) {
    const { taskId } = ctx.request.body;
    const task = await Task.findOne({ id: taskId });

    if (!task) {
        ctx.throw(404, `No task with ${taskId} id`);
    }

    const user = ctx.user;
    user.doneTasks = !!user.doneTasks.find((task) => task.id === taskId)
        ? user.doneTasks.filter((task) => task.id !== taskId)
        : [ ...user.doneTasks, { id: taskId, date: new Date() } ];
    await user.save();
    ctx.user = user;

    ctx.body = { user: userMapper(user) };
}
