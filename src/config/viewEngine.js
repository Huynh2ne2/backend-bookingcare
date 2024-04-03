//var là khai báo biến global, let: chỉ khai báo biến trong này thôi

import express from "express";
//Cú pháp cũ: var express = require('express')

let configViewEngine = (app) =>{
    app.use(express.static("./src/public"))//có thể lấy ảnh trong thư mục public
    app.set("view engine", "ejs"); //Tương tự như file jsp, blade bên java
    app.set("views", "./src/views")
}

module.exports = configViewEngine;
