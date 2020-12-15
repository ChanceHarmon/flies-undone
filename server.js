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
  //species = done

  //more = not  addendum: I decided i would like to look at adding insect guides from another place, and in general a different json format than the per fly thing.

  //First item above = not /////////////////////////////////////

  //Final write actual file post loop = not


  //Next step is below. Now need to pull in my json files and starting making the superagent call dynamic... Going to save and then checkout to a different branch. This one could get ugly(ier)

  superagent.get('https://www.bigyflyco.com/adamscaddis-detail.htm')
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
        // console.log('starting back in imitate loop, trying to use it twice for without a second loop', stepThree[i])
        if (stepThree[i].name === 'blockquote') {
          // console.log('test', stepThree[i].children[1].children[3].children[0].children[1].data)
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

          //Below builds the attracted fish key value array. Some parts I would lke to go back to, but another day, it works for now.

          let species = stepThree[i].children[1].children[3].children[0].children[1].data
          let firstSarray = species.split(',')
          console.log(firstSarray)
          let etcReplace = firstSarray.map(string => {
            // return string ? string.match(/etc./).string.replace(/etc./gi, '') : string;
            if (string.match(/etc./gi)) return string.replace(/etc./gi, '')
            else return string
          })

          //this works, but it is cheating and I know it, I just needed to move past it
          let cleanSpeciesArr = etcReplace.map(fish => {
            let fishStr = fish.trim();
            return fishStr
          })
          funZ.attracted_fish = cleanSpeciesArr;
          console.log('funZ', funZ)
        }
      }
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
