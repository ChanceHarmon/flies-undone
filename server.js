'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cheerio = require('cheerio');
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3002;
const fs = require('fs');


app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (request, response) => {
  response.render('index')
})


app.post('/search', handleSearch);


//This below function works as a reference for grabing image urls, want to keep it for now.

function handleSearch(request, response) {

  //When all of the below works, still need to figure out how to pull in the json lists of the urls, do all of this stuff in a loop, and build json files that are filled with all of these objects from the loop.

  //check list
  //image = done
  //description = done
  //imitate = done
  //species = not
  //more = not

  //First item above = not

  //Final write actual file post loop = not

  superagent.get('https://www.bigyflyco.com/adamscripple-detail.htm')
    .then(result => {
      const funZ = {};
      const $ = cheerio.load(result.text);
      const stepOne = $('#imgMainImage');
      const stepTwo = $('[itemprop ="description"]');
      const stepThree = stepTwo['0'].children;

      //This one below line crates the image url
      const image = stepOne['0'].attribs['data-cfsrc'];
      // This becomes the descrition paragraph
      let descripStr = '';

      // Below is version2 of building description, this seems to work better dynamically for change oof index position of value, but I still want to keep the version underneath for reference for now.
      for (let i = 0; i < stepThree.length; i++) {
        //console.log('stepThree in loop', stepThree[i])
        if (stepThree[i].name === 'ul') {
          //console.log('true')
          stepThree[i].children.forEach(child => {
            if (child.name) {
              if (child.name === 'li') {
                if (child.children[0].children[0].data) {
                  descripStr += child.children[0].children[0].data;
                }
              }
            }
          })
        }

      }

      funZ.image = image;
      funZ.description = descripStr;

      //Below builds the imitates these insects list. Also several versions in to handle index changes in different url's.

      for (let i = 0; i < stepThree.length; i++) {

        const imitateArray = []

        if (stepThree[i].name === 'blockquote') {

          stepThree[i].children[1].children[1].children.forEach(child => {

            for (let i = 0; i < child.children.length; i++) {

              if (child.children[i].type === 'text') {

                let firstCut = child.children[i].data.replace(/,/g, '')

                while (firstCut[0] === ' ' || firstCut.charCodeAt(0) === 160 || firstCut.charCodeAt(0) === 32) {
                  firstCut = firstCut.substring(1)
                }

                if (firstCut[firstCut.length - 1] === ' ' || firstCut.charCodeAt(firstCut.length - 1) === 160 || firstCut.charCodeAt(firstCut.length - 1) === 32) {
                  firstCut = firstCut.substring(0, firstCut.length - 1)
                }
                imitateArray.push(firstCut)
              }
            }
          })
          //This cleans up indexes that are empty from the array
          for (let i = 0; i < imitateArray.length; i++) {
            if (imitateArray[i].length < 1) {
              if (i === 0) {
                imitateArray.shift();
                i = 0;
              } else if (i === imitateArray.length - 1) {
                imitateArray.pop()
              }
            }
          }
          funZ.fly_imitates = imitateArray;
          console.log('funZ', funZ)
        }
      }

      //This is the next start. Agenda is species of fish that are attracted to the fly.

    }).then(() => {
      response.redirect('/');
    })
    .catch(err => console.error(err));
}

app.listen(PORT, () => {
  console.log(`Up on ${PORT}`);
})

  //Leaving this below for reference when I actually get to writing a file again.

//////////////////////////////////////////////////////////////////////
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
