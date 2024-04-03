'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      Bookings.belongsTo(models.Users, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' })
      Bookings.belongsTo(models.Allcodes, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' })

    }
  }
  Bookings.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    statusId: DataTypes.STRING,//quy định là key của bảng allcode
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,//là kiểu Timestamp
    timeType: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Bookings',
  });
  return Bookings;
};