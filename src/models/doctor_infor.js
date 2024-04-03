'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
            Doctor_infor.belongsTo(models.Users, { foreignKey: 'doctorId' })


            Doctor_infor.belongsTo(models.Allcodes, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' })
            Doctor_infor.belongsTo(models.Allcodes, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData' })
            Doctor_infor.belongsTo(models.Allcodes, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' })
        }
    }
    Doctor_infor.init({
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Doctor_infor',
        freezeTableName: true
    });
    return Doctor_infor;
};