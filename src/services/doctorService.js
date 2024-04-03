import { where } from 'sequelize';
import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDocTorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.Users.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })

        } catch (e) {
            reject(e);
        }
    })
}

let getAllDocTors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.Users.findAll({
                where: {
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })

        } catch (e) {
            reject(e)
        }

    })
}

let checkRequiredField = (inputData) => {
    let arrfileds = ['doctorId', 'contentHTML', 'contentMarkdown',
        'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameClinic', 'addressClinic', 'note', 'specialtyId'
    ]

    let isValid = true;
    let element = '';

    for (let i = 0; i < arrfileds.length; i++) {
        if (!inputData[arrfileds[i]]) {
            isValid = false;
            element = arrfileds[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforDocTor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let chechObj = checkRequiredField(inputData);
            // console.log('Huynh check inputdata doctor: ', inputData)
            if (chechObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing paramter: ${chechObj.element}`
                })

            }
            else {
                //upsert to Markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdowns.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,

                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdowns.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false

                    })
                    //console.log 2 trường hợp: raw: true, raw: false
                    console.log(doctorMarkdown)
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }

                //upsert to Doctor infor table
                let doctorInfor = await db.Doctor_infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save()
                } else {
                    //create
                    await db.Doctor_infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

                resolve({
                    errCode: 0,
                    // data: 
                    errMessage: 'Save infor doctor succeed!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let data = await db.Users.findOne({
                    where: {
                        id: inputId
                    },

                    attributes: {
                        exclude: ['password']
                    },
                    //include như là câu lệnh join 2 table
                    include: [
                        {
                            model: db.Markdowns,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcodes,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]

                        },
                    ],
                    raw: false,//false sẽ convert sang object, true được hiểu là sequelize object chứ ko phải là js object
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data)
                    data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                // console.log('Huynh: data send: ', schedule);
                let existing = await db.Schedules.findAll({
                    where: { doctorId: data.doctorId, date: data.formatDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });



                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;//convert a,b string -> int
                });

                //create data

                if (toCreate && toCreate.length > 0) {
                    await db.Schedules.bulkCreate(toCreate);
                }
                // console.log('Check different===========0')
                // console.log('To create: ', toCreate)
                // console.log('Check different===========1')
                // console.log('Find all: ', existing)
                // console.log('Check different=============', toCreate)

                // console.log('Huynh check type of schedule: ', typeof schedule)
                // 
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }


        } catch (e) {
            reject(e);
        }
    })
}

let getSchedulebyDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let dataschedule = await db.Schedules.findAll({
                    where: {
                        doctorId: doctorId,//key 1: trong db, key 2 tham số truyền vào
                        date: date
                    },
                    include: [
                        {
                            model: db.Allcodes, as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Users, as: 'doctorData',

                            attributes: ['firstName', 'lastName']
                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if (!dataschedule) dataschedule = [];
                resolve({
                    errCode: 0,
                    data: dataschedule
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Users.findOne({
                    where: {
                        id: inputId
                    },

                    attributes: {
                        exclude: ['password']
                    },
                    //include như là câu lệnh join 2 table
                    include: [
                        {
                            model: db.Markdowns,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcodes,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]

                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data)
                    data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}


let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                let data = await db.Bookings.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Users,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                        {
                            model: db.Allcodes,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn'],
                        }
                    ],
                    raw: false,//trả ra sequelize object
                    nest: true//trả ra dạng object cho đẹp

                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}


let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                //update patient status
                let appointment = await db.Bookings.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false,
                })
                if (appointment) {
                    appointment.statusId = 'S3';

                    await appointment.save();
                }

                //send email remedy
                console.log('Check server: ', data)
                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    // data: data
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    getTopDocTorHome: getTopDocTorHome,
    getAllDocTors: getAllDocTors,
    saveDetailInforDocTor: saveDetailInforDocTor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getSchedulebyDate: getSchedulebyDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}


//convert date

// if (existing && existing.length > 0) {
//     existing = existing.map(item => {
//         item.date = new Date(item.date).getTime();
//         return item;
//     })
// }
