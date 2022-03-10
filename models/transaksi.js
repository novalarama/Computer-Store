'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.customer, {
        foreignKey: "id_customer",
        as : "customer"
      })

      this.belongsTo(models.admin, {
        foreignKey: "id_admin",
        as : "admin"
      })

      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi",
        as : "detail_transaksi"
      })
    }
  }
  transaksi.init({
    id_transaksi:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_customer: DataTypes.INTEGER,
    id_admin: DataTypes.INTEGER,
    waktu: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: `transaksi`
  });
  return transaksi;
};