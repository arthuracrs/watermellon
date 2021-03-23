module.exports = (req, res) => {
    const flashMessages = []

    flashMessages.push({
        text: 'Voce está autenticado',
        ok: true
    })

    res.json({
        flashMessages: flashMessages,
        user: res.locals.user
    })
}