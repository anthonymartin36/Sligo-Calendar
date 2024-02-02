import express from 'express'

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
  let thisMonth = data.Calendar.find( (thisMonth) => thisMonth.id == today.getMonth()  )
  // Get current Date
  currentDate = Object.assign(
    { cTime: today.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1') },
    currentDate
  )
  // amend the object to contain each Calendar day of the Month
  // Create an Object  that has an object with in it for every day of the month
  const calendarDays = calendarDayCalc(thisMonth)
  //console.log(calendarDays)
  let viewData = {
    ...currentDate,
    ...thisMonth,
    ...calendarDays,
  }
  //console.log(viewData)
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
  const calendarDays =  []
  const notesInDay = thisMonth.notes.filter((note) => note.day != '')
  let note = false
  console.log(notesInDay)
  let k = getFirstDay() - 1// Trying to establish 0 - 6 of week proceeding start of Month
  let weekDay = {}
  //console.log("K: " + k)
  while(k >= 0) {
    let previousDay = {day: getPreviousDays(k), weekday: getPrevWeekDay(getPreviousDays(k))}
    calendarDays.push(previousDay)
    --k
  }
  
  for (let i = 1; i <= thisMonth.days; ++i) {
    // loop through each day in month
    console.log("Month Day : " + i + " weekday: " + getWeekDay(i))
    for (let j = 0; j < notesInDay.length; j++) {
      // loop through the notes for this month from Data Object, via day in note
      if (notesInDay[j].day == i) {
        // if there is a note add it to the array for that day
        weekDay = Object.assign(notesInDay[j], {weekday: getWeekDay(i)})
        // Get the days of the previous week 0 - 6 days - if needed 
        calendarDays.push(weekDay)
        note = true
      }
    }
    if (note == false) { 
      //console.log(" weekDay.notes " + weekDay.notes)
      weekDay = { day: i, weekday: getWeekDay(i) }
      calendarDays.push(weekDay)
    }
    note = false
  }
  let l = 1
  while(getFollowingDays(l) < 7 && getFollowingDays(l) != 0){
    let followingDays = { day: l, weekday: getFollowingDays(l)}
    calendarDays.push(followingDays)
    ++l
  }
  console.log(calendarDays)
  return {calendarDays: calendarDays}
}

function getWeekDay(day){
  var date = new Date()
  var weekDay = new Date(date.getFullYear(), date.getMonth(), day)
  //console.log("get Week Day " + weekDay.getDay())
  return weekDay.getDay()
}

function getFirstDay(){
  const date = new Date()// get date
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1) // get the First day of Month
  //console.log("get the weekday of the 1st of the Month " + firstDay.getDay())
  return  firstDay.getDay()
}

function getPreviousDays(prevDays){
  const date = new Date()
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 0 - prevDays) // get the Last day of Previous month  
  //lastDayOfMonth.setDate(-prevDays)
  //console.log("Day of the previous month : " + lastDayOfMonth.getDay())
  return lastDayOfMonth.getDate()
}

function getPrevWeekDay(day){
  var date = new Date()
  var weekDay = new Date(date.getFullYear(), date.getMonth() - 1, day)
  //console.log("get Week Day " + weekDay.getDay())
  return weekDay.getDay()
}

function getFollowingDays(followingDays){
  const date = new Date()
  const firstDayOfFollowingMonth = new Date(date.getFullYear(), date.getMonth() + 1, followingDays) // get the first day of the Following month  
  //lastDayOfMonth.setDate(-prevDays)
  //console.log("Last Day of the month : " + firstDayOfFollowingMonth.getDay() + " Date: " + firstDayOfFollowingMonth.getDate())
  return firstDayOfFollowingMonth.getDay()
}

export default router