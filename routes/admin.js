const express = require(`express`)
const app = express()

app.use(express.json())

// call user control
let adminControl = require("../controllers/adminControl")

// call middleware
const authorization = require("../middlewares/authorization")
const userValidator = require("../middlewares/userValidator")

//end point GET untuk menampilkan data user
app.get("/",[authorization.authorization], adminControl.getAdmin)

app.post("/find", [authorization.authorization], adminControl.findAdmin)

//end point POST untuk menambah data user
app.post("/", [userValidator.validate],adminControl.addAdmin)

//end point PUT untuk mengedit data user
app.put("/:id_admin", [authorization.authorization], adminControl.editAdmin)

//end point DELETE untuk menghapus data user
app.delete("/:id_admin", [authorization.authorization], adminControl.deleteAdmin)

app.post("/auth", adminControl.authentication)

module.exports = app