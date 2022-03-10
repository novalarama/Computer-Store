const express = require(`express`)
const app = express()

app.use(express.json())

// call pelanggaran control
let productControl = require("../controllers/productControl")

let authorization = require("../middlewares/authorization");
let uploadImage = require("../middlewares/uploadImage");


//end point GET untuk menampilkan data pelanggaran
app.get("/", [authorization.authorization], productControl.getProduct)

app.post("/find", [authorization.authorization], productControl.findProduct)

//end point POST untuk menambah data pelanggaran
app.post("/", [authorization.authorization, uploadImage.upload.single(`image_produk`)],productControl.addProduct)

//end point PUT untuk mengedit data pelanggaran
app.put("/:id_product",[authorization.authorization], productControl.editProduct)

//end point DELETE untuk menghapus data pelanggaran
app.delete("/:id_product", [authorization.authorization],productControl.deleteProduct)

module.exports = app