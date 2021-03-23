module.exports = (req, res) => {
    const flashMessages = []

    flashMessages.push({
        text: 'Logout feito com sucesso',
        ok: true
    })

    res.cookie('token', '', {
        httpOnly: true
    })

    res.send('working')
}