import express from 'express'
import { Console } from 'node:console'

import fs from 'node:fs/promises'
//const fs = require('fs')
//try putting this at the top of the file:
import path from 'path'
import { fileURLToPath } from 'url'

//calculate the current date
const today = new Date()
let currentDate = {
  cMonth: today.toLocaleString('default', { month: 'long' }),
  dayOfWeek: today.toLocaleString('default', { weekday: 'long' }),
  cYear: today.getFullYear(),
}
//then first line after your route declaration:
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//console.log ("directory: " + __dirname  + "   filename:  "  +  __filename  )

const router = express.Router()
// get Data.json Object

router.get('/', async (req, res) => {
  //console.log("Home Directory", path.dirname(__dirname))
  let file = __dirname + '/data.json'
  // console.log('File source : ' + file)
  const data = await awaitingReadFile(file)
  //read in the data object
  let thisMonth = data.Calendar.find(
    (thisMonth) => thisMonth.id == today.getMonth()
  )
  currentDate = Object.assign(
    { cTime: today.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1') },
    currentDate
  )

  // Create an Object  that has an object with in it for every day of the month

  // amend the object to contain each Calendar day of the Month
  const calendarDays = calendarDayCalc(thisMonth)
  console.log(calendarDays)

  let viewData = {
    ...currentDate,
    ...thisMonth,
    //...calendarDays,
  }
  res.render('index', viewData)
})

async function awaitingReadFile(file) {
  let data = ''
  try {
    let json = await fs.readFile(file, 'utf-8')
    data = JSON.parse(json)
    return data
  } catch (err) {
    console.log('Error: ' + err.message)
  }
  return data
}

function calendarDayCalc(thisMonth) {
  const calendarDays = []
  const notesInDay = thisMonth.notes.filter((note) => note.day != '')

  for (let i = 1; i < thisMonth.days + 1; i++) {
    // loop through each day in month
    for (let j = 0; j < notesInDay.length; j++) {
      // loop through the notes for this month from Data Object, via day in note
      if (notesInDay[j].day == i) {
        // if there is a note add it to the array for that day
        calendarDays.push(notesInDay[j])
      }
    }
    if (calendarDays[i - 1] == null) {
      // ensure on start on double up(i starts and 1)
      let day = { day: i }
      calendarDays.push(day)
    }
  }

  // var date = new Date(),
  //   y = date.getFullYear(),
  //   m = date.getMonth()
  // var firstDay = new Date(y, m, 1)
  // console.log(firstDay)
  return calendarDays
}

export default router
