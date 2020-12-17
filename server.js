'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cheerio = require('cheerio');
const cors = require('cors');
const superagent = require('superagent');
const PORT = process.env.PORT || 3002;
const fs = require('fs');
const urlData = require('./data/dry-flies/page-1.json');


app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (request, response) => {
  response.render('index')
})


app.post('/search', handleSearch);


//This below function works as a reference for grabing image urls, want to keep it for now.

function handleSearch(request, response) {

  //SO UGLY AT THE MOMENT !!!!!
  //Reality is that we make it through about 8ish files pretty good, then we hit an anticipated error of when children indexes become undefined. Not too bad though. Broken on adams yellow, but picking up alder?
  //It is skipping yellow and then breaking on alder. Javascript my friend

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


  //console.log('json', urlData.data.dryFlyPageOne);
  //Ais a good link, we just now need todo some kind of Promise all loop to be able to write it all.



  //-------------------- Trying multiple calls, broken on adamsyellow-detail   ---------------------------


  // let promiseArray = [];
  // let sampleArray = [];

  // urlData.data.dryFlyPageOne.forEach(call => {
  //   //console.log('before push', call.dryFlyUrl)
  //   promiseArray.push(superagent.get(call.dryFlyUrl))
  // })
  // Promise.all(promiseArray)
  //   .then(results => {

  //     let returnArray = results.map(result => {
  //       results.forEach(result => {
  //         const funZ = {};
  //         const $ = cheerio.load(result.text);
  //         const stepOne = $('#imgMainImage');
  //         const stepTwo = $('[itemprop ="description"]');
  //         const stepThree = stepTwo['0'].children;

  //         //This one below line crates the image url
  //         const image = stepOne['0'].attribs['data-cfsrc'];
  //         // This becomes the descrition paragraph
  //         let descripStr = '';

  //         // Below is version2 of building description, this seems to work better dynamically for change oof index position of value, but I still want to keep the version underneath for reference for now.
  //         for (let i = 0; i < stepThree.length; i++) {
  //           // console.log('stepThree in loop', stepThree[i])
  //           //need blockquote here for a loop check
  //           if (stepThree[i].name === 'ul') {
  //             // console.log('true')
  //             stepThree[i].children.forEach(child => {
  //               if (child.name) {
  //                 if (child.name === 'li') {
  //                   if (child.children[0].children[0].data) {
  //                     descripStr += child.children[0].children[0].data;
  //                   }
  //                 }
  //               }
  //             })
  //           }
  //           //right here as an else if
  //           //This currently works for description of adamsyellow
  //           else if (stepThree[i].name === 'div') {
  //             if (stepThree[i].children[0]) {
  //               if (stepThree[i].children[0].name === 'ul') {
  //                 stepThree[i].children[0].children.forEach(childLi => {
  //                   if (childLi.name === 'li') {
  //                     childLi.children.forEach(child => {
  //                       // console.log('child', child)
  //                       if (child.children) {
  //                         for (let i = 0; i < child.children.length; i++) {

  //                           if (child.children[i].type === 'text') {
  //                             // console.log('li strings', child.children[i].data)
  //                             descripStr += child.children[i].data;
  //                           }
  //                         }
  //                       }
  //                     })
  //                   }
  //                 })
  //               }
  //             }
  //           }
  //         }

  //         funZ.image = image;
  //         funZ.description = descripStr;
  //         // console.log('funz after img and description', funZ)

  //         //Below builds the imitates these insects list. Also several versions in to handle index changes in different url's.

  //         for (let i = 0; i < stepThree.length; i++) {

  //           const imitateArray = []
  //           // console.log('starting back in imitate loop, trying to use it twice for without a second loop', stepThree[i])
  //           if (stepThree[i].name === 'blockquote') {
  //             // console.log('test', stepThree[i].children[1].children[3].children[0].children[1].data)
  //             stepThree[i].children[1].children[1].children.forEach(child => {

  //               for (let i = 0; i < child.children.length; i++) {

  //                 if (child.children[i].type === 'text') {

  //                   let firstCut = child.children[i].data.replace(/,/g, '')

  //                   while (firstCut[0] === ' ' || firstCut.charCodeAt(0) === 160 || firstCut.charCodeAt(0) === 32) {
  //                     firstCut = firstCut.substring(1)
  //                   }

  //                   if (firstCut[firstCut.length - 1] === ' ' || firstCut.charCodeAt(firstCut.length - 1) === 160 || firstCut.charCodeAt(firstCut.length - 1) === 32) {
  //                     firstCut = firstCut.substring(0, firstCut.length - 1)
  //                   }
  //                   imitateArray.push(firstCut)
  //                 }
  //               }
  //             })
  //             //This cleans up indexes that are empty from the array
  //             for (let i = 0; i < imitateArray.length; i++) {
  //               if (imitateArray[i].length < 1) {
  //                 if (i === 0) {
  //                   imitateArray.shift();
  //                   i = 0;
  //                 } else if (i === imitateArray.length - 1) {
  //                   imitateArray.pop()
  //                 }
  //               }
  //             }
  //             funZ.fly_imitates = imitateArray;

  //             //Below builds the attracted fish key value array. Some parts I would lke to go back to, but another day, it works for now.

  //             let species = stepThree[i].children[1].children[3].children[0].children[1].data
  //             let firstSarray = species.split(',')
  //             // console.log(firstSarray)
  //             let etcReplace = firstSarray.map(string => {
  //               // return string ? string.match(/etc./).string.replace(/etc./gi, '') : string;
  //               if (string.match(/etc./gi)) return string.replace(/etc./gi, '')
  //               else return string
  //             })

  //             //this works, but it is cheating and I know it, I just needed to move past it
  //             let cleanSpeciesArr = etcReplace.map(fish => {
  //               let fishStr = fish.trim();
  //               return fishStr
  //             })
  //             funZ.attracted_fish = cleanSpeciesArr;
  //             console.log('funZ', funZ)
  //           }
  //         }
  //         return funZ
  //       })
  //       console.log('mapped everything', returnArray)


  //     })

  //**************************        Single URL CALL       ******************************* 



  superagent.get('https://www.bigyflyco.com/alder-dry-kly-detail.htm')
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
        // console.log('stepThree in loop', stepThree[i])
        //need blockquote here for a loop check
        if (stepThree[i].name === 'ul') {
          console.log('true')
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
        //right here as an else if
        //This currently works for description of adamsyellow
        else if (stepThree[i].name === 'div') {
          if (stepThree[i].children[0]) {
            // console.log('test step', stepThree[i].children[0])
            if (stepThree[i].children[0].name === 'ul') {
              stepThree[i].children[0].children.forEach(childLi => {
                if (childLi.name === 'li') {
                  childLi.children.forEach(child => {
                    // console.log('child', child)
                    if (child.children) {
                      for (let i = 0; i < child.children.length; i++) {

                        if (child.children[i].type === 'text') {
                          // console.log('li strings', child.children[i].data)
                          descripStr += child.children[i].data;
                        }
                      }
                    }
                  })
                }
              })
            } else if (stepThree[i].children[0].children[1]) {
              if (stepThree[i].children[0].children[1].name === 'ul') {
                stepThree[i].children[0].children[1].children.forEach(childLi => {
                  if (childLi.name === 'li') {
                    childLi.children.forEach(child => {
                      // console.log('child', child)
                      if (child.children) {
                        for (let i = 0; i < child.children.length; i++) {

                          if (child.children[i].type === 'text') {
                            // console.log('li strings', child.children[i].data)
                            descripStr += child.children[i].data.replace(/\r?\n|\r/g, ' ');
                          }
                        }
                      }
                    })
                  }
                })
              }
            }
          }
        }
      }

      funZ.image = image;
      funZ.description = descripStr;
      console.log('funz after img and description', funZ)

      //Below builds the imitates these insects list. Also several versions in to handle index changes in different url's.

      const imitateArray = []
      for (let i = 0; i < stepThree.length; i++) {

        // console.log('starting back in imitate loop', stepThree[i])
        if (stepThree[i].name === 'blockquote') {
          // console.log('test', stepThree[i].children[1].children[3].children[0].children[1].data)
          console.log('in imitate first case, 3rd edge case', stepThree[i].children)




          //Kinda lost here. Need to address a seperate else if staement here. But I am tired. Something in this needs to address is a children index or childre exisits. Tomorrow



          if (stepThree[i].children[1].children[1]) {
            stepThree[i].children[1].children[1].children.forEach(child => {
              // console.log('in loop for first case', child)
              for (let i = 0; i < child.children.length; i++) {

                if (child.children[i].type === 'text') {
                  console.log('text', child.children[i])
                  let firstCut = child.children[i].data.replace(/,/g, '')
                  while (firstCut[0] === ' ' || firstCut.charCodeAt(0) === 160 || firstCut.charCodeAt(0) === 32) {
                    firstCut = firstCut.substring(1)
                  }

                  if (firstCut[firstCut.length - 1] === ' ' || firstCut.charCodeAt(firstCut.length - 1) === 160 || firstCut.charCodeAt(firstCut.length - 1) === 32) {
                    firstCut = firstCut.substring(0, firstCut.length - 1)
                  }
                  console.log('firstcut', firstCut)
                  imitateArray.push(firstCut)

                }
              }
            })

          }




          stepThree[i].children[1].children[1].children.forEach(child => {
            // console.log('in loop for first case', child)
            for (let i = 0; i < child.children.length; i++) {

              if (child.children[i].type === 'text') {
                console.log('text', child.children[i])
                let firstCut = child.children[i].data.replace(/,/g, '')
                while (firstCut[0] === ' ' || firstCut.charCodeAt(0) === 160 || firstCut.charCodeAt(0) === 32) {
                  firstCut = firstCut.substring(1)
                }

                if (firstCut[firstCut.length - 1] === ' ' || firstCut.charCodeAt(firstCut.length - 1) === 160 || firstCut.charCodeAt(firstCut.length - 1) === 32) {
                  firstCut = firstCut.substring(0, firstCut.length - 1)
                }
                console.log('firstcut', firstCut)
                imitateArray.push(firstCut)

              }
            }
          })





        } else if (stepThree[i].name === 'div' && stepThree[i].children) {
          stepThree[i].children.forEach(child => {
            if (child.name && child.name === 'blockquote') {
              child.children.forEach(child => {
                if (child.name === 'blockquote') {
                  if (child.children[0].children) {
                    child.children[0].children[1].children.forEach(item => {
                      // console.log('in item', item.children[0])
                      if (item.children[0]) {
                        item.children[0].children.forEach(child => {
                          if (child.type === 'text') {
                            // console.log('made it', child.data)

                            let firstCut = child.data.replace(/,/g, '')

                            while (firstCut[0] === ' ' || firstCut.charCodeAt(0) === 160 || firstCut.charCodeAt(0) === 32) {
                              firstCut = firstCut.substring(1)
                            }

                            if (firstCut[firstCut.length - 1] === ' ' || firstCut.charCodeAt(firstCut.length - 1) === 160 || firstCut.charCodeAt(firstCut.length - 1) === 32) {
                              firstCut = firstCut.substring(0, firstCut.length - 1)
                            }
                            imitateArray.push(firstCut)
                          }

                        })

                      }
                    })
                  }
                }
              })
              // console.log('in first blockquote', child.children)
            }
          })

        }
        //This cleans up indexes that are empty from the array
        // console.log('imitate array', imitateArray)
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
      }
      // console.log('funz after imitate', funZ)

      //---------- Going to call imitate good again, for now, moving on


      //Below builds the attracted fish key value array. Some parts I would lke to go back to, but another day, it works for now.
      for (let j = 0; j < stepThree.length; j++) {
        // console.log('in loop working on species', stepThree[j])
        if (stepThree[j].name === 'blockquote') {
          let species = stepThree[j].children[1].children[3].children[0].children[1].data
          let firstSarray = species.split(',')
          console.log(firstSarray)
          let etcReplace = firstSarray.map(string => {
            // return string ? string.match(/etc./).string.replace(/etc./gi, '') : string;
            if (string.match(/etc./gi)) return string.replace(/etc./gi, '')
            else return string
          })
          let cleanSpeciesArr = etcReplace.map(fish => {
            let fishStr = fish.trim();
            return fishStr
          })
          funZ.attracted_fish = cleanSpeciesArr;
          console.log('funZ', funZ)
        } else if (stepThree[j].name === 'div' && stepThree[j].children.length > 1) {
          // console.log('in else statement for species', stepThree[j].children)
          stepThree[j].children.forEach(child => {
            // console.log('first child in spec', child)
            if (child.name === 'blockquote') {
              // console.log('in block quote', child.children[1])
              if (child.children[1].children[0].children) {
                if (child.children[1].children[0].children[3]) {
                  if (child.children[1].children[0].children[3].children[0].children) {
                    // console.log(child.children[1].children[0].children[3].children[0].children[0])


                    let innerChild = child.children[1].children[0].children[3].children[0].children[0].children
                    innerChild.forEach(child => {
                      console.log('in forEach', child)
                      if (child.type === 'text') {
                        console.log('hooray', child.data)
                        let species = child.data
                        let firstSarray = species.split(',')
                        console.log(firstSarray)
                        let etcReplace = firstSarray.map(string => {
                          // return string ? string.match(/etc./).string.replace(/etc./gi, '') : string;
                          if (string.match(/etc./gi)) return string.replace(/etc./gi, '')
                          else return string
                        })
                        let cleanSpeciesArr = etcReplace.map(fish => {
                          let fishStr = fish.trim();
                          return fishStr
                        })
                        funZ.attracted_fish = cleanSpeciesArr;
                        console.log('funZ', funZ)
                      }
                    })
                  }
                }
              }
            }
          })
        }

        //this works, but it is cheating and I know it, I just needed to move past it

        // let cleanSpeciesArr = etcReplace.map(fish => {
        //   let fishStr = fish.trim();
        //   return fishStr
        // })
        // funZ.attracted_fish = cleanSpeciesArr;
        // console.log('funZ', funZ)

      }

    }) // take this out if you go back to testing multiple
    .then(() => {
      response.redirect('/');
    })
    .catch(err => console.error(err));
  // })  Put these in when doing multiple urls
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






/*
Here's the deal, you have a ton shit above. The basics are this. you made it through the superagent loop up until you got to two that had nothing for description, starting at adams yellow. We have solved that. There was still bizzare behaviour from something after alder fly or something. The description  on that was there but formatted really strange and then broke completely. Not sure if that was just javascript finally catching up or not. But, need to follow out the other few arrays for adams yellow so we know it works, and then run it again tomorrow to see if we make it past alder. Learnng curves have no lines when you are inventing to suit ones own thoughts
*/