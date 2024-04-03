const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('hoidanit', 'root', null, {
//   host: 'localhost',//địa chỉ server
//   dialect: 'mysql',
//   logging: false
// });

// //Để dùng từ khóa await phải có async : đây chính là hàm bất đồng bộ
// let connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// module.exports = connectDB;





const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD
  , {
    host: process.env.DB_HOST,//địa chỉ server
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions:
      process.env.DB_SSL === 'true' ?
        {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        } : {}
    ,
    query: {
      "raw": true
    },
    timezone: "+07:00"
  });

//Để dùng từ khóa await phải có async : đây chính là hàm bất đồng bộ
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDB;