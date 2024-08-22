const { nanoid } = require('nanoid');

const Category = require('../models/Category');
const Task = require('../models/Task');

const mapCategory = require('../mappers/category');
const taskMapper = require('../mappers/task');

module.exports.categoryList = async function categoryList(ctx, next) {
    const categories = await Category.find({});

    ctx.body = { categories: categories.map(mapCategory) }
}

module.exports.getCategories = async function getCategories(ctx, next) {
    const categories = await Category.find({});
    const tasks = await Task.find({});

    const categoriesWithTasks = categories.map((category) => {
        const categoryTasks = tasks.filter((task) => task.category === category._id);

        return {
            ...(mapCategory(category)),
            tasks: tasks.map(taskMapper)
        }
    })

    ctx.body = { categories: categoriesWithTasks }
}
