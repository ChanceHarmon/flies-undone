//This function is currently being stored here for future reference. Currently is has already served it's purpose of building out the data set it was made for.

function urlGenerator(request, response) {
  console.log('made it', request.body)
  let temp = [];

  superagent.get('https://www.bigyflyco.com/items/Flies/Dry-Flies/list.htm')
    .then(result => {
      const $ = cheerio.load(result.text)
      const stepOne = $('#tblInner')
      const stepBack = stepOne['0'].children[0].children;

      stepBack.forEach(child => {
        if (child) {
          child.children.forEach(subChild => {

            temp.push({ dryFlyUrl: subChild.children[2].children[6].children[1].children[1].children[1].children[1].children[1].children[1].children[1].children[1].children[1].attribs.href });

          })
        }
      })

      let testVar = { data: { dryFlyPageOne: temp } }
      let otherVar = JSON.stringify(testVar);

      fs.writeFile('data/dry-flies/page-1.json', otherVar, (err) => {
        if (err) throw err;
      })
    }).then(() => {
      response.redirect('/')
    })
    .catch(err => console.error(err))
}