import db from '../models/index';
require('dotenv').config();

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {


            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params'
                })

            } else {

                let s = await db.Specialties.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })

            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // let data = await db.select('*').from('clinic').findAll() ;
            let data = await db.Specialties.findAll();
            // let data = await db.select('*').from('Specialties');

            if (data && data.length > 0) {
                // console.log('Huynh check data: ', data)
                data.map(item => {

                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params'
                })
            } else {

                let data = await db.Specialties.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                });

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        //tìm thông tin cascc bác sĩ có specialtyId = id(trong bảng specialty)
                        doctorSpecialty = await db.Doctor_infor.findAll({
                            where: {
                                specialtyId: inputId,
                            },
                            attributes: ['doctorId', 'provinceId']
                        })

                    } else {
                        doctorSpecialty = await db.Doctor_infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })

                    }
                    data.doctorSpecialty = doctorSpecialty;

                } else {
                    data = {};

                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}