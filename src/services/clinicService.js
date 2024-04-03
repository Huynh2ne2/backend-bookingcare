import db from '../models/index';
require('dotenv').config();
const knex = require('knex');

let createNewSClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address
                || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params'
                })

            } else {

                await db.Clinics.create({
                    name: data.name,
                    address: data.address,
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
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinics.findAll();
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

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params'
                })
            } else {

                let data = await db.Clinics.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                });

                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_infor.findAll({
                        where: {
                            clinicId: inputId,
                        },
                        attributes: ['doctorId', 'clinicId']
                    })
                    data.doctorClinic = doctorClinic;

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
    createNewSClinic: createNewSClinic,
    getDetailClinicById: getDetailClinicById,
    getAllClinic: getAllClinic
}