import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/', (req, res) => {
    //     return res.send('Hello world with node js')
    // });
    //Muốn lấy thông tin: get, tạo thông tin thì dùng (post),  cập nhật thông tin thì dùng (put), xóa thì (delete)
    //rest API
    //Lấy thông tin thì dùng get
    //Mỗi 1 lần mà người dùng lấy địa chỉ đường link trên website thì express sẽ tìm kiếm đường link ấy trong file web.js
    //Tại sao nó lại tìm kiếm ở đây???
    //Bởi vì trong file server.js chúng ta đã nhúng tất cả các link cho biết rồi
    router.get('/hoidanit', (req, res) => {
        return res.send('Hello world with hoidanit')
    });

    //cách chuyển tới file homeController
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    //có nghĩa là khi người dùng truy cập tới đường link này 
    //thì express nó sẽ bảo là t sẽ gọi cái file homeController và nó sẽ gọi cái hàm getHomePage r nó sẽ trả về dòng chữ
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);//nhập, tạo thông tin
    router.get('/get-crud', homeController.displayGetCRUD);//lấy thông tin
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);


    router.get('/delete-crud', homeController.deleteCRUD);

    //sử dụng bên react thì dùng từ nối /api
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    //lấy thông tin người dùng thì sử dụng phương thức get
    router.get('/api/allcode', userController.getAllCode);


    //Lấy thông tin 10 bác sĩ đầu tien
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDocTors);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);

    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);

    router.get('/api/get-schedule-doctor-by-date', doctorController.getSchedulebyDate);

    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    //confirm email

    //specialty
    router.post('/api/create-new-specialty', specialtyController.createNewSpecialty);

    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);

    //khoa khám
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);


    //Phòng khám (clinics)
    router.post('/api/create-new-clinic', clinicController.createNewClinic);

    router.get('/api/get-all-clinic', clinicController.getAllClinic);

    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);


    //Hiển thị danh sách các bệnh nhân của bác sĩ đó
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);

    router.post('/api/send-remedy', doctorController.sendRemedy);


    return app.use("/", router);
    //cách viết api
    // return app.use("/v1/api", router);
}

module.exports = initWebRoutes;