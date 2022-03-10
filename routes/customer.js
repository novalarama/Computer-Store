const express = require(`express`)
const app = express()

app.use(express.json())

// call customer control
let customerControl = require("../controllers/customerControl")

// call the middlewares
let authorization = require("../middlewares/authorization");
let uploadImage = require("../middlewares/uploadImage");
const userValidator = require("../middlewares/userValidator")

app.get("/", [authorization.authorization],customerControl.getCustomer)
app.post("/find", [authorization.authorization], customerControl.findCustomer)
app.post("/", [authorization.authorization, uploadImage.upload.single(`image_customer`)],customerControl.addCustomer)
app.put("/:id_customer", [authorization.authorization],customerControl.editCustomer)
app.delete("/:id_customer", [authorization.authorization],customerControl.deleteCustomer)

module.exports = app