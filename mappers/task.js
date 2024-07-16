module.exports = function mapTask(task) {
    return {
        id: task.id,
        text: task.text,
        src: task.src,
    }
}
