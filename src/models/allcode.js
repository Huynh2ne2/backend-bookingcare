'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      // define association here
      Allcodes.hasMany(models.Users, { foreignKey: 'positionId', as: 'positionData' })
      Allcodes.hasMany(models.Users, { foreignKey: 'gender', as: 'genderData' })
      Allcodes.hasMany(models.Schedules, { foreignKey: 'timeType', as: 'timeTypeData' })

      Allcodes.hasMany(models.Doctor_infor, { foreignKey: 'priceId', as: 'priceTypeData' })
      Allcodes.hasMany(models.Doctor_infor, { foreignKey: 'provinceId', as: 'provinceTypeData' })
      Allcodes.hasMany(models.Doctor_infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })

      Allcodes.hasMany(models.Bookings, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })

    }
  }
  Allcodes.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcodes',
  });
  return Allcodes;
};