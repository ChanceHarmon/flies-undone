'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cheerio = require('cheerio');
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3002;
const fs = require('fs');
const { fileURLToPath } = require('url');

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


  superagent.get('https://www.bigyflyco.com/adamscaddis-detail.htm')
    .then(result => {
      const funZ = {};
      const $ = cheerio.load(result.text);
      const stepOne = $('#imgMainImage');
      const stepTwo = $('[itemprop ="description"]');
      const stepThree = stepTwo['0'].children;
      console.log(stepThree)
      const image = stepOne['0'].attribs['data-cfsrc'];
      let descripStr = '';
      //console.log('testing', stepTwo['0'].children)

      //keep this for now
      //console.log('stepTwo', stepTwo['0'].children[4].children[1].children[0].children[0].data)//this works for a single li for description

      //also  stepTwo['0'].children[4] I think that index of 5 or 6 is the next step for the other props I want, so keep track of that for future reference 

      //this step is store the li strings
      // Below is version2, this seems to work better dynamically for change oof index position of value, but I still want to keep the version underneath for reference for now.
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
      // stepTwo['0'].children[4].children.forEach(child => {
      //   if (child.name) {
      //     if (child.name === 'li') {
      //       if (child.children[0].children[0].data) {
      //         descripStr += child.children[0].children[0].data;
      //       }
      //     }
      //   }
      // })
      //console.log('string', descripStr)
      //Don't touch above, works perfectly!!!!!!

      funZ.image = image;
      funZ.description = descripStr;
      console.log('funz', funZ)//YES!! Object traveler works
      //next step, get that nested block info of imitate, fish, and more. Let's go !!!!!

      //console.log('here it g\'s')
      //console.log('sub-block', stepTwo['0'].children[5])

      //Currently this kinda works for imaitate list for adams detail
      //Update, we are aboout to hack this thing up, but hopefully in similar fashin to the way description is built above we find the way :)

      // const subContentBase = stepTwo['0'].children[6].children[1].children[1].children[0].children;

      for (let i = 0; i < stepThree.length; i++) {
        console.log('stepThree in imitate')
        if (stepThree[i].name === 'blockquote') {
          stepThree[i].children[1].children[1].children[0].children.forEach(item => {
            if (item.type === 'text') {
              //so far this has gotten me to the same place I think I need to be to start the ridiculous whitespace trimmer, goals baby
              console.log('in new loop key key 3', item)
            }
          })
        }

      }
      // const imitateArray = []
      // subContentBase.forEach(item => {
      //   //console.log('item', item)
      //   if (item.type === 'text') {
      //     //console.log(item.data)


      //     let firstCut = item.data.replace(/,/g, '')
      //     //firstCut.trim();
      //     let test;
      //     for (let i = 0; i < firstCut.length; i++) {
      //       console.log('first cut in loop', firstCut.charCodeAt(0), 'i in loop', i)
      //       if (firstCut[0] === ' ' || firstCut.charCodeAt(0) === 160) {
      //         console.log('first cut in loop if space is first index', firstCut, 'i in loop', i)
      //         firstCut = firstCut.substring(1, firstCut.length - 1)
      //         i = 0
      //       }

      //     }
      //     console.log('firstcut', firstCut)
      //     console.log('test', test)
      //     imitateArray.push(firstCut)

      //     // funZ.imitates =
      //     //   console.log('each fly type if type is text', item.data)
      //   }

      // })
      // console.log(imitateArray)
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
    }).then(() => {
      response.redirect('/');
    })
    .catch(err => console.error(err));
}



app.listen(PORT, () => {
  console.log(`Up on ${PORT}`);
})

