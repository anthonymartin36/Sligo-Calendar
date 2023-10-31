import express from 'express'
import { Console } from 'node:console';

import fs from 'node:fs/promises'
//const fs = require('fs')
//try putting this at the top of the file:
import path from 'path';
import { fileURLToPath } from 'url';

//calculate the current date
const today = new Date()
let currentDate = {
  cMonth: today.toLocaleString('default', { month: 'long' }),
  dayOfWeek: today.toLocaleString('default', {weekday: 'long'}),
  cYear: today.getFullYear(),    
}
//then first line after your route declaration:
const  __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log ("directory: " + __dirname  + "   filename:  "  +  __filename  )

const router = express.Router()
// get Data.json Object

router.get('/', async (req, res) => {
  

  //console.log("Home Directory", path.dirname(__dirname))
  let file = __dirname + '/data.json'
 // console.log('File source : ' + file)
  const data = await awaitingReadFile(file)
  //read in the data object 
  let thisMonth = data.Calendar.find((thisMonth) => thisMonth.id == today.getMonth())
  currentDate = Object.assign({cTime: today.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")}, currentDate)
  let viewData = {
    ...currentDate,
    ...thisMonth
  } 
  console.log(viewData)
  //establish the data month and date to display from to days date.
  //create an object to return to index to display. 
  //console.log("Time " + currentDate.time + " / Day : " + currentDate.dayOfWeek + " / Month : " + currentDate.month + " / Year : " + currentDate.year)
  res.render('index', viewData)
})

async function awaitingReadFile(file){
  let data = ""
  try{
    let json = await fs.readFile(file, 'utf-8')
    data = JSON.parse(json)
    return data
  }
  catch(err)
  {
    console.log("Error: " + err.message)
  }
  return data
}

export default router