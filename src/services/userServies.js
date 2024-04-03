import { resolveInclude } from "ejs";
import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user exist -> checkUserEmail(true)

                let user = await db.Users.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    //Compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    // let check = true;
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        // console.log(user);
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }

                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found."
                }
            }
            else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "your's email isn't exist in your system. Please try other email..."
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })


}

// let compareUserPassword = () =>{
//     return new Promise((resolve, reject) =>{
//         try{

//         }catch(e){
//             reject(e)
//         }
//     })
// }

//Để check email của một người dùng cần import db vào


let checkUserEmail = (useremail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { email: useremail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.Users.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }

            if (userId && userId !== 'ALL') {
                users = await db.Users.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist???
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already used. Please try another email!!!'
                })
            } else {
                let hashpasswordfrombcrypt = await hashUserPassword(data.password);
                await db.Users.create({
                    email: data.email,
                    password: hashpasswordfrombcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar

                    //bởi vì input không tạo nên sẽ bỏ trường image và positionid

                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }


        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.Users.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: 'Users not exist'
            })
        }
        // await foundUser.destroy();//C1
        //C2
        console.log('huynh check', foundUser)

        await db.Users.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete Successfull!'
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let user = await db.Users.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();
                // await db.Users.save({
                //     firstName: data.firstname,
                //     lastName: data.lastname,
                //     address: data.address
                // });
                resolve({
                    errCode: 0,
                    message: 'Update user succeed!'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    message: 'User not found'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeSerVice = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters !'
                })
            } else {
                let res = {};
                let allcode = await db.Allcodes.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }


        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeSerVice: getAllCodeSerVice
}