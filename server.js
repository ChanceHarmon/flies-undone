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


  //check list
  //image = done
  //description = done
  //imitate = not
  //species = not
  //more = not done

  //console.log('made it', request.body)
  // let temp = [];


  superagent.get('https://www.bigyflyco.com/adams-detail.htm')
    .then(result => {

      const $ = cheerio.load(result.text)
      const stepOne = $('#imgMainImage')
      const stepTwo = $('[itemprop ="description"]')
      const image = stepOne['0'].attribs['data-cfsrc'];
      let descripStr = '';

      //keep this for now
      //console.log('stepTwo', stepTwo['0'].children[4].children[1].children[0].children[0].data)//this works for a single li for description

      //also  stepTwo['0'].children[4] I think that index of 5 or 6 is the next step for the other props I want, so keep track of that for future reference 

      //this step is store the li strings

      stepTwo['0'].children[4].children.forEach(child => {
        if (child.name) {
          if (child.name === 'li') {
            if (child.children[0].children[0].data) {
              descripStr += child.children[0].children[0].data
            }
          }
        }
      })
      //console.log('string', descripStr)
      //Don't touch above, works perfectly!!!!!!


      //next step, get that nested block info of imitate, fish, and more. Let's go !!!!!



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
    }).then(() => {
      response.redirect('/')
    })

    .catch(err => console.error(err))
}



app.listen(PORT, () => {
  console.log(`Up on ${PORT}`)
})

