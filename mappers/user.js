module.exports = function mapUser(user) {
    return {
        email: user.email,
        displayName: user.displayName,
        doneTasks: user.doneTasks,
        preferences: user.preferences,
    }
}
