const{body} = require(`express-validator`)

exports.validate = [
    body(`password`)
    .isLength({ min : 8})
    .withMessage(`Password e kudu 8 karakter`)
    .notEmpty()
    .withMessage(`password e kudu diisi`),

    body(`username`).notEmpty()
    .withMessage(`Username e kudu diisi`)
]