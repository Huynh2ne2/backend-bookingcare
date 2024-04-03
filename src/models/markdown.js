'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdowns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      // define association here
      Markdowns.belongsTo(models.Users, {foreignKey: 'doctorId'})
      
    }
  }
  Markdowns.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdowns: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Markdowns',
  });
  return Markdowns;
};