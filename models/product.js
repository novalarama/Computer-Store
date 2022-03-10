'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_produk",
        as : "detail_transaksi"
      })
    }
  }
  product.init({
    id_produk:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_produk: DataTypes.STRING,
    harga: DataTypes.DOUBLE,
    stok: DataTypes.INTEGER,
    image_produk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
    tableName: `product`
  });
  return product;
};