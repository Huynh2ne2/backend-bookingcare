'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      // define association here
    }
  }
  Histories.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    files: DataTypes.TEXT//lưu đường link của file
  }, {
    sequelize,
    modelName: 'Histories',
  });
  return Histories;
};