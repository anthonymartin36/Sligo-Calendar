import express from 'express'
const router = express.Router()
// get Data.json Object
import fs from 'node:fs/promises'


router.get('/', async (req, res) => {
  //calculate the current date
  const date = new Date()
  let json = await fs.readFile('./data/data.json', 'utf-8')
  console.log(json.calendar.id[0])
  //read in the data object 
  //establish the data month and date to display from to days date.
  //create an object to return to index to display. 

  res.render('index', {date})
})


export default router