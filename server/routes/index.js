import express from 'express'

import fs from 'node:fs/promises'
//const fs = require('fs')
//try putting this at the top of the file:
import path from 'path';
import { fileURLToPath } from 'url';

const today = new Date()
const currentDate = {
  month: today.toLocaleString('default', { month: 'long' }),
  dayOfWeek: today.toLocaleString('default', {weekday: 'long'}),
  year: today.getFullYear(),
  time: today.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
  
}
//then first line after your route declaration:
const  __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log ("directory: " + __dirname  + "   filename:  "  +  __filename  )

const router = express.Router()
// get Data.json Object



router.get('/', async (req, res) => {
  //calculate the current date

  //console.log("Home Directory", path.dirname(__dirname))
  let file = __dirname + '/data.json'
 // console.log('File source : ' + file)
  const data = await awaitingReadFile(file)
  //read in the data object 

  //establish the data month and date to display from to days date.
  //create an object to return to index to display. 
  console.log("Time " + currentDate.time + " / Day : " + currentDate.dayOfWeek + " / Month : " + currentDate.month + " / Year : " + currentDate.year)
  res.render('index', {today})
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