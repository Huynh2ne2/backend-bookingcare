'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      // define association here
      Users.belongsTo(models.Allcodes, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      Users.belongsTo(models.Allcodes, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      Users.hasOne(models.Markdowns, { foreignKey: 'doctorId' })//foreign key này được định nghĩa tại bên Markdown vd: nếu bên Markdown là mabs thì foreignkey đổi doctorId thành mabs
      Users.hasOne(models.Doctor_infor, { foreignKey: 'doctorId' })

      Users.hasMany(models.Schedules, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' })
      Users.hasMany(models.Bookings, { foreignKey: 'patientId', as: 'patientData' })
    }
  }
  Users.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
    schema: 'public',
  });
  return Users;
};