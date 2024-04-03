import express  from "express";
import bodyParser from "body-parser";//hỗ trợ lấy các tham số từ client
// /user?id=7 để lấy được số 7 ra thì bắt buộc phải dùng thư viện body-parser
import connectDB from "./config/connectDB";
import viewEngine from  "./config/viewEngine";
import initWebRoutes from './route/web';
// require('dotenv').config({path: './src/.env'});//giúp nó khai báo dotenv để chạy dòng "let port = process.env.PORT || 6969;"
import cors from 'cors';
require('dotenv').config('.env')
//Nếu để file .env thì không cần khai báo path còn nếu nằm trong thư mục nào thì cần phải truyền đường path


let app = express();
app.use(cors({ credentials: true,origin: true}));

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

//config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json({limit: '50mb'}));//tăng giới hạn file upload
app.use(bodyParser.urlencoded({limit: '50mb',  extended: true}))

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
//Port == underfined => port = 6969

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port)
})

