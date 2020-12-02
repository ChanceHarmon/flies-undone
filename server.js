'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cheerio = require('cheerio');
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3002;


app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (request, response) => {
  response.render('index')
})


app.post('/search', handleSearch);

function handleSearch(request, response) {
  console.log('made it', request.body)
  let string = request.body.name;
  // let url = 'https://explorer.natureserve.org/api/data/speciesSearch?criteriaType=species&textCriteria%5BparamType%5D=quickSearch&textCriteria%5BsearchToken=salmon'
  // let url = 'https://explorer.natureserve.org/api/data/speciesSearch'
  // let queryParams = {
  //   "criteriaType": "species",
  //   "textCriteria": [{
  //     "paramType": "quickSearch",
  //     "searchToken": string
  //   }]
  // }




  // const $ = cheerio.load(html);

  // $('.post-preview').each((i, el) => {
  //   const title = $(el)
  //     .find('.post-title')
  //     .text()
  //     .replace(/\s\s+/g, '');
  //   const link = $(el)
  //     .find('a')
  //     .attr('href');
  //   const date = $(el)
  //     .find('.post-date')
  //     .text()
  //     .replace(/,/, '');

  //   // Write Row To CSV
  //   writeStream.write(`${title}, ${link}, ${date} \n`);
  // });

  superagent.get('https://www.bigyflyco.com/items/Flies/Dry-Flies/list.htm')
    .then(result => {
      let temp = [];
      const $ = cheerio.load(result.text)
      //console.log($('#imgMainImage'))
      const stepOne = $('#imgMainImage')
      const stepTwo = Object.entries(stepOne)
      stepTwo.forEach(item => {
        //console.log('in foreach', item)
        if (item[1].attribs) {
          temp.push(item[1].attribs['data-cfsrc']);
        }
      })
      console.log(temp)


      // const proofOLife = $('#tblInner tbody').each((i, el) => {
      //   console.log('line 63', Object.entries(el)[6][1])
      // })
      //console.log('line 65', proofOLife)

      // https://www.flyfishusa.com/resize?po=http%3a%2f%2fwww.flyfishusaimages.com%2fShared%2fImages%2fProduct%2fAutumn-Splendor-Conehead%2f18060-1000.jpg&bw=500&bh=500

      //console.log(`https://www.flyfishusa.com/${imageUrl}`)


      //console.log(Object.keys(result))
      //console.log(result.text, typeof (result.text))
      //console.log(JSON.parse(result.text))
    })

    // superagent.post(url)
    //   .send(queryParams)
    //   .then(data => {
    //     console.log(data.body)
    //   })
    .catch(err => console.error(err))
}



app.listen(PORT, () => {
  console.log(`Up on ${PORT}`)
})


