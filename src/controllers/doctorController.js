import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit)
        limit = 10;
    try {
        let response = await doctorService.getTopDocTorHome(+limit);
        return res.status(200).json(response);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getAllDocTors = async (req, res) => {
    //req, res đã có sẵn trong express
    try {
        let doctors = await doctorService.getAllDocTors();
        console.log('Huynh check doctors: ', doctors)
        return res.status(200).json(doctors)


    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDocTor(req.body);
        // console.log('Huynh check doctors: ', doctors)
        return res.status(200).json(response);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        //infor ở đây là một object
        return res.status(200).json(infor);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        //infor ở đây là một object
        return res.status(200).json(infor);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let getSchedulebyDate = async (req, res) => {
    try {
        //method get: req.query vd: ?id=40
        //method post: req.body//không có trên url
        let a = await doctorService.getSchedulebyDate(req.query.doctorId, req.query.date);
        return res.status(200).json(a);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let a = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(a);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let a = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(a);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let a = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(a);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}


let sendRemedy = async (req, res) => {
    try {
        let a = await doctorService.sendRemedy(req.body);
        return res.status(200).json(a);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}



module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDocTors: getAllDocTors,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getSchedulebyDate: getSchedulebyDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy:sendRemedy
}