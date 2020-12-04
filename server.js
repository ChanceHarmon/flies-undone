'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cheerio = require('cheerio');
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3002;
const fs = require('fs');
//const writeStream = fs.createWriteStream('test.json');


app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (request, response) => {
  response.render('index')
})


app.post('/search', handleSearch);


//This below function works as a reference for grabing image urls, want to keep it for now.

function handleSearch(request, response) {
  console.log('made it', request.body)
  // let temp = [];


  // superagent.get('https://www.bigyflyco.com/items/Flies/Dry-Flies/list.htm')
  //   .then(result => {

  //     const $ = cheerio.load(result.text)
  //     //console.log($('#imgMainImage'))
  //     const stepOne = $('#imgMainImage')
  //     const stepTwo = Object.entries(stepOne)
  //     stepTwo.forEach((item, i) => {
  //       console.log('in foreach', item)
  //       if (item[1].attribs) {
  //         temp.push({ dryFlyUrl: item[1].attribs['data-cfsrc'] });
  //         //temp.push(item[1].attribs['data-cfsrc']);
  //       }
  //     })
  //     let testVar = { data: { dryFlyPageOne: temp } }
  //     let otherVar = JSON.stringify(testVar)
  //     fs.writeFile('data/dry-flies/page-1.json', otherVar, (err) => {
  //       if (err) throw err;
  //     })

  //     // fs.writeFile('test3.json', temp, (err) => {
  //     //   if (err) throw err;
  //     // })
  //   })

  //   .catch(err => console.error(err))
}



app.listen(PORT, () => {
  console.log(`Up on ${PORT}`)
})

