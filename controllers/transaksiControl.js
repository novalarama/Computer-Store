const detail_transaksi = require("../models/detail_transaksi");

// memanggil file model untuk pelanggaran
let modelTransaksi = require("../models/index").transaksi;
let modelDetailTransaksi = require("../models/index").detail_transaksi;
let modelCustomer = require("../models/index").customer;
let modelProduct = require("../models/index").product;

//import sequelize operator
let sequelize = require(`sequelize`);
let Op = sequelize.Op;

exports.getTransaksi = async (request, response) => {
  // variabel async digunakan ketika memakai await
  let dataTransaksi = await modelTransaksi.findAll({
    include: [
      "customer",
      "admin",
      {
        model: modelDetailTransaksi,
        as: "detail_transaksi",
        include: ["product"],
      },
    ],
  }); //biasanya menggunakan seperti inti hanya untuk get
  return response.json({
    Count: dataTransaksi.length,
    Pelanggaran: dataTransaksi,
  });
};

exports.filterTransaksi = async (request, response) => {
  // filter tanggal awal dan akhir
  let start = request.body.start; // tgl awal
  let end = request.body.end; // tgl akhir

  let dataTransaksi = await modelTransaksi.findAll({
    include: [
      "customer",
      "admin",
      {
        model: modelDetailTransaksi,
        as: "detail_transaksi",
        include: ["product"],
      },
    ],
    where: {
      waktu: { [Op.between]: [start, end] },
    },
  });
  return response.json(dataPS);
};

exports.filterNama = async (request, response) => {
  let id = request.params.id_customer;

  let dataTransaksi = await modelTransaksi.findAll({
    include: [
      "customer",
      "admin",
      {
        model: modelDetailTransaksi,
        as: "detail_transaksi",
        include: ["product"],
      },
    ],
    where: {
      //waktu: {[Op.between]:[start, end]}
      id_customer: id,
    },
  });
  return response.json({
    Count: dataTransaksi.length,
    Pelanggaran: dataTransaksi,
  });
};

//untuk handle add data pelanggaran siswa
exports.addTransaksi = async (request, response) => {
  // proses pengurangan
  // 1. Mengambil nilai stok product dari tabe; product
  let product = await modelProduct.findOne({
    where: { id_produk: request.body.id_produk },
  });
  let jumlah = product.stok;
  // 2. Mengambil nilai qty dari tiap transaksi
  let detail = request.body.detail_transaksi;
  let jml = 0;
  for (let i = 0; i < detail.length; i++) {
    // ambil poin dari tiap transaksi
    let product = await modelProduct.findOne({
      where: { id_produk: detail[i].id_produk },
    });
    let qty = product.qty;
    jml += qty;
  }
  // 3. stok product dikurangi jumlah qty transaksi
  let newStok = jumlah - jml;
  // 4 . update poin siswa nya
  await modelProduct.update(
    {
      stok: newStok,
    },
    { where: { id_produk: request.body.id_produk } }
  );

  //proses insert
  let newData = {
    id_customer: request.body.id_customer,
    id_admin: request.body.id_admin,
    waktu: request.body.waktu,
  };
  // insert ke tabel transaksi
  modelTransaksi
    .create(newData)
    .then(async(result) => {
      let product = await modelProduct.findOne({
        where: { id_produk: request.body.id_produk },
      });
      let hargaProduk = product.harga;
      let quantity = request.body.qty;

      let totalBayar = hargaProduk * quantity;

      let detail_transaksi = {
        produk: request.body.produk,
        qty: request.body.qty,
        harga: totalBayar,
      };
      //asumsinya adl detail_transaksi bertipe array
      let id = result.id_transaksi;
      for (let i = 0; i < produk.length; i++) {
        produk[i].id_transaksi = id;
      }

      //insert ke tabel detail_transaksi
      modelDetailTransaksi
        .bulkCreate(detail_transaksi) // menggunakan bulk karena bertipe array which is banyak data
        .then((result) => {
          return response.json({
            message: `Data Transaction has been inserted`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
};

//untuk handle edit data transaksi
exports.editTransaksi = async (request, response) => {
  let product = await modelProduct.findOne({
    where: { id_produk: request.body.id_produk },
  });
  let jumlah = product.stok;
  // 2. Mengambil nilai qty dari tiap transaksi
  let detail = request.body.detail_transaksi;
  let jml = 0;
  for (let i = 0; i < detail.length; i++) {
    // ambil poin dari tiap transaksi
    let product = await modelProduct.findOne({
      where: { id_produk: detail[i].id_produk },
    });
    let qty = product.qty;
    jml += qty;
  }
  // 3. stok product dikurangi jumlah qty transaksi
  let newStok = jumlah - jml;
  // 4 . update poin siswa nya
  await modelProduct.update(
    {
      stok: newStok,
    },
    { where: { id_produk: request.body.id_produk } }
  );

  let id = request.params.id_transaksi;
  let dataTransaksi = {
    id_customer: request.body.id_customer,
    id_admin: request.body.id_admin,
    waktu: request.body.waktu,
  };
  // eksekusi
  modelTransaksi
    .update(dataTransaksi, { where: { id_transaksi: id } })
    .then(async (result) => {
      // ada 2 detail -> 1 detail
      // hapus data detail yang lama
      // step 1 : hapus semua detail berdasarkan id_transaksi
      await modelDetailTransaksi.destroy({
        where: {
          id_transaksi: request.params.id_transaksi,
        },
      });

      // step 2: insert data detail terbaru
      let product = await modelProduct.findOne({
        where: { id_produk: request.body.id_produk },
      });
      let hargaProduk = product.harga;
      let quantity = request.body.qty;

      let totalBayar = hargaProduk * quantity;

      let detail_transaksi = {
        produk: request.body.produk,
        qty: request.body.qty,
        harga: totalBayar,
      };
      let id = result.id_transaksi;
      for (let i = 0; i < detail_transaksi.length; i++) {
        detail_transaksi[i].id_transaksi = id;
      }

      //insert ke tabel detail_transaksi
      modelDetailTransaksi
        .bulkCreate(detail_transaksi) // menggunakan bulk karena bertipe array which is banyak data
        .then((result) => {
          return response.json({
            message: `Data Transaction has been inserted`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
};

//untuk handle delete data transaksi
exports.deleteTransaksi = (request, response) => {
  let id = request.params.id_transaksi;

  // eksekusi
  modelDetailTransaksi
    .destroy({ where: { id_transaksi: id } })
    .then((result) => {
      let id = request.params.id_transaksi;

      //hapus data pelanggaran siswa
      modelTransaksi
        .destroy({
          where: { id_transaksi: id },
        })
        .then((result) => {
          return response.json({
            message: `Data Transaction Has been deleted`,
          });
        })
        .catch((error) => {
          return response.json({
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
};
