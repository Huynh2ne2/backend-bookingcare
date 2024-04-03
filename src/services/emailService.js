require('dotenv').config();
// const nodemailer = require("nodemailer");

import nodemailer from 'nodemailer';


let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 587,
        // secure: false, // Use `true` for port 465, `false` for all other ports
        // auth: {
        //     user: process.env.EMAIL_APP,
        //     pass: process.env.EMAIL_APP_PASSWORD,
        // },
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // use TLS
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let info = await transporter.sendMail({
        from: '"Huỳnh nè 👻" <danghuynh1526@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên web booking care</p>
        <p>Thông tin đặt lịch khám </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        
        <p>Nếu đã xác nhận thông tin đăng ký trên là đúng 
        thì click vào đường link bên dưới để xác nhận hoàn tất thủ tục đặt lịch khám
        </p>

        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>

        <div>
            Xin chân thành cảm ơn
        </div>
        `
    }
    if (dataSend.language === 'en') {
        result = result = `
        <h3>Dear, ${dataSend.patientName} !</h3>
        <p>You received this email because you booked an online medical appointment on the booking care website</p>
        <p>Information on making an appointment </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        
        <p>If you have confirmed the above registration information is correct
        Then click on the link below to confirm completion of the appointment booking procedure
        </p>

        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>

        <div>
        Sincerely thank
        </div>
        `

    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                // host: "smtp.gmail.com",
                // port: 587,
                // secure: false, // Use `true` for port 465, `false` for all other ports
                // auth: {
                //     user: process.env.EMAIL_APP,
                //     pass: process.env.EMAIL_APP_PASSWORD,
                // },
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // use TLS
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            let info = await transporter.sendMail({
                from: '"Huỳnh nè 👻" <danghuynh1526@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Thông tin đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {   // encoded string as an attachment
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.jpg`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });
            resolve()

        } catch (e) {
            reject(e)
        }
    })

}


let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên web booking care thành công</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm bên dưới</p>
        <div>
            Xin chân thành cảm ơn
        </div>
        `
    }
    if (dataSend.language === 'en') {
        result = result = `
        <h3>Dear, ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on the booking care website</p>
        
       
        <div>
        Sincerely thank
        </div>
        `

    }
    return result;
}


module.exports = {
    sendSimpleEmail, getBodyHTMLEmail,
    sendAttachment, getBodyHTMLEmailRemedy
}