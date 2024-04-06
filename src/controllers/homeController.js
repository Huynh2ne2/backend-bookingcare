import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {

    try {
        let data = await db.Users.findAll();
        console.log('-------------------')
        console.log(data)
        console.log('-------------------')
        return res.render('homePage.ejs', {
            data: JSON.stringify(data) //data chuyển sang string
        });
    } catch (e) {
        console.log(e)
    }

}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

/*Để sử dụng được hàm getHomePage ở ngoài file homeController.js
thì cần exports nó ra
Cần exports một cái object???
Trong file homeController này viết rất nhiều hàm 
Nên có thể quản lý các object dễ hơn
Một object lun có
object{
    key: '',
    value: ''
}
*/

//tạo function
let getCRUD = (req, res) => {
    // return res.send('Get CRUD with Page HoiDanIT')
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message)
    // console.log(req.body);//lấy các tham số từ client sang server
    return res.send('post crud from server');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    // console.log('-----------------------')
    // console.log(data)
    // console.log('-----------------------')
    // return res.send('Get CRUD with Page HoiDanIT')
    return res.render('displayCRUD.ejs', {
        dataTable: data//chèn 1 biến cho data
    });
}

let getEditCRUD = async (req, res) => {
    // http://localhost:8090/edit-crud?id=1
    // nếu id thì điền id còn username là username
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // console.log('----------------------')
        // console.log(userData)
        // console.log('----------------------')
        return res.render('editCrud.ejs', {
            user: userData
        });
    }
    else {
        return res.send('Users not found...');
    }
    // console.log(req.query.id)
}

let putCRUD = async (req, res) => {
    let data = req.body;//req.body là sẽ lấy được tất cả các thông tin được nhập từ input
    // updateUserData

    // return res.send('Update done!!!');
    //thay vì in ra dòng lệnh như trên thì muốn trả ra một cái người dùng luôn
    let allusers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allusers//chèn 1 biến cho data
    });
}

let deleteCRUD = async (req, res) => {

    let id = req.query.id;
    //check lại cái id xem nó có lấy được chưa???
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('delete user succeed!!!');
    } else {
        return res.send('User not found!!!');
    }

}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}
