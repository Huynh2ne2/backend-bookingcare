'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      Schedules.belongsTo(models.Allcodes, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' })
      Schedules.belongsTo(models.Users, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' })
    }
  }
  Schedules.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    doctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedules',
  });
  return Schedules;
};