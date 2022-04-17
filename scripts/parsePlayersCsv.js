#!/usr/bin/env node

console.log("Test script starting.");
const [, , ...args] = process.argv;
const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csv-parse");
const path = require("path");

const MIDDLEWARE_BASE_URL = `https://5c75f3ks0k.execute-api.us-east-1.amazonaws.com`;
const SOCCER_PATH = `/soccer`;
const PLAYERS_PATH = `/players`;

const SOURCE = {
  url: "url=",
  file: "file=",
};

const USAGE_MESSAGES = {
  url: `node ${path.basename(__filename)} ${SOURCE.url}<full url>`,
  file: `node ${path.basename(__filename)} ${SOURCE.file}<file path>`,
}
const GENERAL_USAGE_MESSAGE = `Usage: '${USAGE_MESSAGES.url}' or '${USAGE_MESSAGES.file}'`;

if (args.length === 0) {
  console.log(
    `Error: No source specified. ${GENERAL_USAGE_MESSAGE}`
  );
} else {
  const source = args[0];
  if (source.includes(SOURCE.url)) {
    console.log(
      `Error: Url file processing not implemented.`
    );
  } else if (source.includes(SOURCE.file)) {
    parseCsvFile(source.replace(SOURCE.file, ""));
  } else {
    console.log(
      `Error: unknown source type. ${GENERAL_USAGE_MESSAGE}`
    );
  }
}

function parseCsvFile(file) {
  if (file && file.length > 0) {
    const fs = require('fs'); 
    const csv = require('csv-parser');

    var players = [];

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', function(data){
      try {
        var player = {
          'name': data.name,
          'number': data.number ? parseInt(data.number) : 0,
          'goals': parseInt(data.goals),
          'assists': parseInt(data.assists)
        };
        console.log(`Parsed player data: ${JSON.stringify(player)}`);

        players.push(player);
      }
      catch(err) {
        //error handler
        console.log(`Error parsing csv data: ${err}`);
      }
    })
    .on('end',function(){
      //some final operation
      console.log(`csv parsing finished, beginning upload of player data`);
      players.forEach(player => {
        uploadPlayerData(player);
      });
      console.log(`Finished uploading player data`);
    }); 
  } else {
    console.log(`Error: file path is null or empty`);
    return 1;
  }
}

async function uploadPlayerData(player) {
  try {
    const response = await fetch(
      `${MIDDLEWARE_BASE_URL}${SOCCER_PATH}${PLAYERS_PATH}`,
      {
        method: 'post',
        body: JSON.stringify(player),
        headers: {'Content-Type': 'application/json'}
      }
    );

    if (response.ok) {
      console.log(`Successfully uploaded player: ${JSON.stringify(player)}`);
    } else {
      console.log(`Error uploading player data: ${response.status}`);
    }
  } catch (error) {
    console.log(`Error uploading player data: ${error}`);
  }
}
