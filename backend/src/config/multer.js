const multer = require("multer")

module.exports = {
    updateUser: multer().fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
}
