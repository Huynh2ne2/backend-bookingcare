import userServices from "../services/userServies"
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashpassword = await bcrypt.hashSync(password, salt);
            resolve(hashpassword);
        }catch(e){
            reject(e);
        } 
    })
}

//tạo hàm
let handleLogin = async(req, res) =>{
    //Đối với api (chạy bên front end)
    let email = req.body.email;
    let password = req.body.password;

    if(!email || ! password){
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!!!'
        })
    }
 let userData = await userServices.handleUserLogin(email, password);   
    console.log(userData)
    return res.status(200).json({
        // errCode: 0,
        // message: 'Hello word',
        // yourEmail: email,
        // test: 'test'
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async(req, res) =>{
    // let id = req.body.id; //all, id
    //thay bằng
    let id = req.query.id; 
    
    // console.log(users)
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }
    let users = await userServices.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })

}

let handleCreateNewUser = async(req, res) =>{
    let message = await userServices.createNewUser(req.body);
    // console.log(message);
    return res.status(200).json(message);
}

let handleEditUser = async(req, res) =>{
    let data = req.body;
    let message = await userServices.updateUserData(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async(req, res) =>{
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter!"
        })
    }
    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllCode = async(req, res) =>{
    try{
        // setTimeout(async () =>{
        //     let data = await userServices.getAllCodeSerVice(req.query.type);
        //     console.log(data)
        //     return res.status(200).json(data);
        // }, 3000)
        let data = await userServices.getAllCodeSerVice(req.query.type);
        console.log(data)
        return res.status(200).json(data);
    }catch(e){
        console.log('get all code: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage:'Eror from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode:getAllCode
}