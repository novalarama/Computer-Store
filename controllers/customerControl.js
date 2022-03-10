let modelCustomer = require("../models/index").customer

const md5 = require("md5")
let jwt = require(`jsonwebtoken`)
const{validationResult} = require(`express-validator`)
let path = require("path")
let fs =  require("fs")

//import sequelize operator
let sequelize = require(`sequelize`)
let Op = sequelize.Op

exports.getCustomer = (request,response) => {
    modelCustomer.findAll()
    .then(result => {
        return response.json({
            Count : result.length,
            Customer : result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.findCustomer = async(request, response) => {
    let keyword = request.body.keyword

    let dataCustomer = await modelCustomer.findAll({
        where : {
            [Op.or] : {
                nama_customer: {[Op.like]:`%${keyword}%`},
                phone_customer: {[Op.like]:`%${keyword}%`},
                alamat_customer: {[Op.like]:`%${keyword}%`},
                username: {[Op.like]:`%${keyword}%`}
            }
        }
    })

    return response.json({
        Count : dataCustomer.length,
        Customer : dataCustomer
    })
}
exports.addCustomer = (request,response) => {
    let error= validationResult(request)
    if(!error.isEmpty()){
        return response.json(error.array())
    }
    
    if(!request.file){
        return response.json({
            message : `nothing to upload`
        })
    }
    // tampung data request
    let newCustomer = {
        nama_customer: request.body.nama_customer,
        phone_customer: request.body.phone_customer,
        alamat_customer: request.body.alamat_customer,
        image_customer: request.file.filename,
        username: request.body.username,
        password: md5(request.body.password)

    }
    modelCustomer.create(newCustomer)
    .then(result => {
        return response.json({
            message : `Data Customer has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.editCustomer = async(request,response) => {
    let idCustomer = request.params.id_customer
    let dataCustomer = {
        nama_customer: request.body.nama_customer,
        phone_customer: request.body.phone_customer,
        alamat_customer: request.body.alamat_customer,
        username: request.body.username,
        password: md5(request.body.password)
    }
    if (request.file) {
        // jika edit menyertakan file gambar
        let customer = await modelCustomer.findOne({ where: { id_customer: idCustomer } })
        let oldFileName = customer.image_customer

        // delete file
        let location = path.join(__dirname, "../image_customer", oldFileName)
        fs.unlink(location, error => console.log(error))

        // menyisipkan nama file baru ke dalam objek dataSiswa
        dataCustomer.image_customer = request.file.filename
    }

    modelCustomer.update(dataCustomer, { where: { id_customer: idCustomer } })
        .then(result => {
            return response.json({
                message: `Data Customer has been updated`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
}

exports.deleteCustomer = async(request,response) => {
    let idCustomer = request.params.id_customer

    //ambil dulu data filename yang akan dihapus
    let customer = await modelCustomer.findOne({where: {id_customer: idCustomer}})
    if(customer){
        let oldFileName = customer.image_customer

        //delete file
        let location = path.join(__dirname, "../image_customer", oldFileName)
        fs.unlink(location, error => console.log(error))
    }

    // eksekusi 
    modelCustomer.destroy({where :{id_customer:idCustomer}})
    .then(result => {
        return response.json({
            message : `Data Customer has been deleted`
        })
    })
    .catch(error => {
        return response.json({
            message : error.message
        })
    })
}