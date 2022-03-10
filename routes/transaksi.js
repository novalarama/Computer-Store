const express = require(`express`)
const app = express()

app.use(express.json())

// call pelanggaran control
let transaksiControl = require("../controllers/transaksiControl")

let authorization = require("../middlewares/authorization");

//end point GET untuk menampilkan data pelanggaran
app.get("/", [authorization.authorization], transaksiControl.getTransaksi)

app.post("/find", [authorization.authorization], transaksiControl.filterTransaksi)

//end point POST untuk menambah data pelanggaran
app.post("/", [authorization.authorization],transaksiControl.addTransaksi)

//end point PUT untuk mengedit data pelanggaran
app.put("/:id_transaksi", [authorization.authorization],transaksiControl.editTransaksi)

//end point DELETE untuk menghapus data pelanggaran
app.delete("/:id_transaksi", [authorization.authorization],transaksiControl.deleteTransaksi)

module.exports = app