import bcrypt from 'bcryptjs';
import db from "../models/index";
import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);

//Lấy hashpassword
// let createNewUser = async(data) =>{
//     let hashpasswordfrombcrypt = await hashUserPassword(data.password);//c1
//     console.log('data from service')
//     console.log(data)
//     // console.log(await hashUserPassword(data.password))//c2
//     console.log(hashpasswordfrombcrypt)//c1
// }
//Đưa hashpassword vào db
//để tạo một người dùng trong db
//import db vào đây

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpasswordfrombcrypt = await hashUserPassword(data.password);
            await db.Users.create({
                email: data.email,
                password: hashpasswordfrombcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                phoneNumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
                //bởi vì input không tạo nên sẽ bỏ trường image và positionid

            })
            resolve('CREATE A NEW USER SUCDEEED !!!');
        } catch (e) {
            reject(e);//log lỗi ra
        }
    })
    // let hashpasswordfrombcrypt = await hashUserPassword(data.password);//c1
    // console.log('data from service')
    // console.log(data)
    // // console.log(await hashUserPassword(data.password))//c2
    // console.log(hashpasswordfrombcrypt)//c1
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpassword = await bcrypt.hashSync(password, salt);
            resolve(hashpassword);
        } catch (e) {
            reject(e);
        }
    })
}

//lấy tất cả người dùng nên khỏi chèn biến
//đây là 1 hàm xử lý bất đồng bộ nên controller cần khai báo async
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.Users.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                // raw:true,
                where: {
                    id: userid
                },
                raw: true,
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve([])
            }
        } catch (e) {
            reject(e);
        }
    })
}

// let updateUserData= (data) =>{
//     console.log('Data from service')
//     console.log(data)
// }

//update trên db

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstname;
                user.lastName = data.lastname;
                user.address = data.address;

                await user.save();
                let allusers = await db.Users.findAll();
                resolve(allusers);
            }
            else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
            }
            resolve(); //return;//hàm này là thoát ra khỏi thôi
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}