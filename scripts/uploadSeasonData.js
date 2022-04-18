#!/usr/bin/env node

const [, , ...args] = process.argv;
const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csv-parse");
const path = require("path");

const MIDDLEWARE_BASE_URL = `https://5c75f3ks0k.execute-api.us-east-1.amazonaws.com`;
const SOCCER_PATH = `/soccer`;
const SEASONS_PATH = `/seasons`;

const ARGS = {
  file: "file=",
  year: "year=",
  session: "session=",
  record: "record=",
};

const USAGE_MESSAGES = {
  file: `node ${path.basename(__filename)} ${ARGS.year}<year> ${ARGS.session}<session number> ${ARGS.record}<W-L-D record> ${ARGS.file}<stats csv file path>`,
}
const GENERAL_USAGE_MESSAGE = `Usage: '${USAGE_MESSAGES.file}'`;

if (args.length < 4) {
  console.log(
    `Error: Not enough arguments. ${GENERAL_USAGE_MESSAGE}`
  );
} else {
  var source;
  var year;
  var session;
  var record;

  args.forEach(arg => {
    if (arg.includes(ARGS.file)) {
      source = arg.replace(ARGS.file, "");
    } else if (arg.includes(ARGS.year)) {
      year = arg.replace(ARGS.year, "");
    } else if (arg.includes(ARGS.session)) {
      session = arg.replace(ARGS.session, "");
    } else if (arg.includes(ARGS.record)) {
      record = arg.replace(ARGS.record, "");
    }
  });

  if (source && year && session && record) {
    parseCsvFile(source, year, session, record);
  } else {
    console.log(
      `Error: invalid arguments. ${GENERAL_USAGE_MESSAGE}`
    );
  }
}

function parseCsvFile(file, year, session, record) {
  if (file && file.length > 0) {
    const fs = require('fs'); 
    const csv = require('csv-parser');

    // players is map of name to player instead of array in season structure
    var players = {};

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', function(data){
      try {
        var player = {
          'name': data.name,
          'goals': data.goals ? parseInt(data.goals) : 0,
          'assists': data.assists? parseInt(data.assists) : 0,
          'clean_sheet_halves': data.clean_sheet_halves ? parseInt(data.clean_sheet_halves) : 0
        };
        console.log(`Parsed player data: ${JSON.stringify(player)}`);

        players[player.name] = player;
      }
      catch(err) {
        console.log(`Error parsing csv data: ${err}`);
      }
    })
    .on('end',function(){
      console.log(`csv parsing finished, uploading season data`);

      // create season object for upload
      const season = {
        'year': parseInt(year),
        'session': parseInt(session),
        'id': `soccer-${year}-s${session}`,
        'record': record,
        'players': players,
        'games': []
      }
      uploadSeasonData(season);
    }); 
  } else {
    console.log(`Error: file path is null or empty`);
    return 1;
  }
}

async function uploadSeasonData(season) {
  try {
    const response = await fetch(
      `${MIDDLEWARE_BASE_URL}${SOCCER_PATH}${SEASONS_PATH}`,
      {
        method: 'post',
        body: JSON.stringify(season),
        headers: {'Content-Type': 'application/json'}
      }
    );

    if (response.ok) {
      console.log(`Successfully uploaded season: ${JSON.stringify(season)}`);
    } else {
      console.log(`Error uploading season data: ${response.status}`);
    }
  } catch (error) {
    console.log(`Error uploading season data: ${error}`);
  }
}
