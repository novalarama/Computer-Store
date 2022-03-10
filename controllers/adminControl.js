const md5 = require("md5")
let jwt = require(`jsonwebtoken`)
const{validationResult} = require(`express-validator`)

// memanggil file model untuk admin
let modelAdmin = require("../models/index").admin

// import sequelize operator
let sequelize = require(`sequelize`)
let Op = sequelize.Op

exports.getAdmin = (request, response) => {
    modelAdmin.findAll()
    .then(result => {
        return response.json({
            Count : result.length,
            Admin : result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.findAdmin = async(request, response) => {
    let keyword = request.body.keyword

    let dataAdmin = await modelAdmin.findAll({
        where : {
            [Op.or] : {
                nama_admin: {[Op.like]:`%${keyword}%`},
                username: {[Op.like]:`%${keyword}%`}
            }
        }
    })

    return response.json({
        Count : dataAdmin.length,
        Admin : dataAdmin
    })
}

exports.addAdmin = (request, response) => {
    let error = validationResult(request)
    if(!error.isEmpty()){
        return response.json(error.array())
    }

    // tampung data request
    let newAdmin = {
        nama_admin: request.body.nama_admin,
        username: request.body.username,
        password: md5(request.body.password)
    }
    modelAdmin.create(newAdmin)
    .then(result => {
        return response.json({
            message : `Data Admin has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.editAdmin = (request, response) => {
    let idAdmin = request.params.id_admin
    let dataAdmin = {
        nama_admin: request.body.nama_admin,
        username: request.body.username,
        password: md5(request.body.password)
    }
    // eksekusi 
    modelAdmin.update(dataAdmin, {where : {id_admin:idAdmin}})
    .then(result => {
        return response.json({
            message : `Data Admin has been updated`
        })
    })
    .catch(error => {
        return response.json({
            message : error.message
        })
    })
}

exports.deleteAdmin = (request, response) => {
    let idAdmin = request.params.id_admin

    // eksekusi 
    modelAdmin.destroy({where : idAdmin})
    .then(result => {
        return response.json({
            message : `Data Admin has been deleted`
        })
    })
    .catch(error => {
        return response.json({
            message : error.message
        })
    })
}

exports.authentication = async(request, response) => {
    let data = {
        username : request.body.username,
        password : md5(request.body.password)
    }

    // validasi
    let result = await modelAdmin.findOne({where : data})

    if (result) {
        // data ditemukan

        // payload adalah data yang akan dienkripsi
        let payload = JSON.stringify(result) // untuk mengubah data objek ke json

        let secretKey = `Computer Store`

        // generate token
        let token = jwt.sign(payload, secretKey)
        return response.json({
            logged: true,
            token: token
        })
    } else {
        // data tidak ditemukan
        return response.json({
            logged: false,
            message : `Invalid Username or Password, Please Try Again!`
        })
    }
}