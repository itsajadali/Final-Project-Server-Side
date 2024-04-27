const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Features = require("../models/featuresModel");

dotenv.config({ path: "./config.env" });


const DB = process.env.DATABASE;
const connectToDB = async () => {
    try {
      await mongoose.connect(DB, {
        autoIndex: true,
      });
      console.log("Connected to Mongodb Atlas");
    } catch (error) {
      console.error(error);
    }
  };
  connectToDB();



const TestData = JSON.parse(fs.readFileSync(`${__dirname}/featuresTest.json`, "utf-8"));

// console.log(typeof TestData);

// const featuresTest = [];

// for (let i = 0; i < TestData.length; i++) {
//     // Add the current object's enmo and anglez values to the nested array
//     featuresTest.push([TestData[i].enmo, TestData[i].anglez]);
// }



// fs.writeFileSync(`${__dirname}/featuresTest.json`, JSON.stringify(featuresTest), "utf-8");



const features = JSON.parse(fs.readFileSync(`${__dirname}/featuresTest.json`, "utf-8"));



const importDate =  async() => {

    const dd = {
        features: features,
        user: "662bf302a1a30d50d4dfb2d9"
      }
     await Features.create(dd);

    console.log("data has imported");
  };


  importDate();
