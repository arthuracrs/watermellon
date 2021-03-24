module.exports = (req, res) => {
    const flashMessages = []

    flashMessages.push({
        text: 'Voce está autenticado',
        ok: true
    })

    res.cookie('token', '', {
        httpOnly: true
    })

    res.send('working')
}