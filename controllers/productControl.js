// memanggil file model untuk pelanggaran
let modelProduct = require("../models/index").product

let path = require("path")
let fs =  require("fs")

//import sequelize operator
let sequelize = require(`sequelize`)
let Op = sequelize.Op

exports.getProduct = async(request, response) => { // variabel async digunakan ketika memakai await
    let dataProduct = await modelProduct.findAll() //biasanya menggunakan seperti inti hanya untuk get
    return response.json({
        Count : dataProduct.length,
        Product : dataProduct
    })
}

exports.findProduct = async(request, response) => {
    let keyword = request.body.keyword

    let dataProduct = await modelProduct.findAll({
        where : {
            [Op.or] : {
                nama_produk: {[Op.like]:`%${keyword}%`},
                harga: {[Op.like]:`%${keyword}%`},
                stok: {[Op.like]:`%${keyword}%`}
            }
        }
    })

    return response.json({
        Count : dataProduct.length,
        Product : dataProduct
    })
}


//untuk handle add data pelanggaran
exports.addProduct = (request, response) => {
    if(!request.file){
        return response.json({
            message : `nothing to upload`
        })
    }
    // tampung data request
    let newProduct = {
        nama_produk: request.body.nama_produk,
        harga: request.body.harga,
        stok: request.body.stok,
        image_produk: request.file.filename
    }
    modelProduct.create(newProduct)
    .then(result => {
        return response.json({
            message : `Data Product has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

//untuk handle edit data pelanggaran
exports.editProduct = async(request, response) => {
    let idProduk = request.params.id_produk
    let dataProduct = {
        nama_produk: request.body.nama_produk,
        harga: request.body.harga,
        stok: request.body.stok
    }
    if (request.file) {
        // jika edit menyertakan file gambar
        let product = await modelProduct.findOne({ where: { id_produk: idProduk } })
        let oldFileName = product.image_produk

        // delete file
        let location = path.join(__dirname, "../image_produk", oldFileName)
        fs.unlink(location, error => console.log(error))

        // menyisipkan nama file baru ke dalam objek dataSiswa
        dataProduct.image_product = request.file.filename
    }

    modelProduct.update(dataProduct, { where: { id_produk: idProduk } })
        .then(result => {
            return response.json({
                message: `Data Product has been updated`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
}

//untuk handle delete data pelanggaran
exports.deleteProduct = async(request, response) => {
    let idProduk = request.params.id_produk

    //ambil dulu data filename yang akan dihapus
    let product = await modelProduct.findOne({where: {id_produk: idProduk}})
    if(product){
        let oldFileName = product.image_produk

        //delete file
        let location = path.join(__dirname, "../image_produk", oldFileName)
        fs.unlink(location, error => console.log(error))
    }

    // eksekusi 
    modelProduct.destroy({where :{id_produk:idProduk}})
    .then(result => {
        return response.json({
            message : `Data Product has been deleted`
        })
    })
    .catch(error => {
        return response.json({
            message : error.message
        })
    })
}