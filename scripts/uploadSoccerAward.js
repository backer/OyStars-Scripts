#!/usr/bin/env node

const [, , ...args] = process.argv;
const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csv-parse");
const path = require("path");

const MIDDLEWARE_BASE_URL = `https://5c75f3ks0k.execute-api.us-east-1.amazonaws.com`;
const SOCCER_PATH = `/soccer`;
const AWARDS_PATH = `/awards`;

const ARGS = {
  file: "file=",
  award: "award="
};

const USAGE_MESSAGES = {
  file: `node ${path.basename(__filename)} ${ARGS.award}<award name> ${ARGS.file}<awards csv file path>`,
}
const GENERAL_USAGE_MESSAGE = `Usage: '${USAGE_MESSAGES.file}'`;

if (args.length < 2) {
  console.log(
    `Error: Not enough arguments. ${GENERAL_USAGE_MESSAGE}`
  );
} else {
  var source;
  var award;

  args.forEach(arg => {
    if (arg.includes(ARGS.file)) {
      source = arg.replace(ARGS.file, "");
    } else if (arg.includes(ARGS.award)) {
      award = arg.replace(ARGS.award, "");
    }
  });

  if (source && award) {
    parseCsvFile(source, award);
  } else {
    console.log(
      `Error: invalid arguments. ${GENERAL_USAGE_MESSAGE}`
    );
  }
}

function parseCsvFile(file, awardName) {
  if (file && file.length > 0) {
    const fs = require('fs'); 
    const csv = require('csv-parser');

    var awards = [];

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', function(data){
      try {
        var notableStats = "";
        if (data.goals && data.assists) {
          notableStats = `${data.goals}, ${data.assists}`;
        } else if (data.goals) {
          notableStats = `${data.goals}`;
        } else if (data.assists) {
          notableStats = `${data.assists}`;
        }

        var award = {
          'award': awardName,
          'year': parseInt(data.year),
          'session': parseInt(data.session),
          'name': data.name,
          'notable_stats': notableStats
        };
        console.log(`Parsed award data: ${JSON.stringify(award)}`);

        awards.push(award);
      }
      catch(err) {
        console.log(`Error parsing csv data: ${err}`);
      }
    })
    .on('end',function(){
      console.log(`csv parsing finished, uploading award data`);

      awards.forEach(award => {
        uploadAwardData(award);
      });
      console.log(`Finished uploading award data`);
    }); 
  } else {
    console.log(`Error: file path is null or empty`);
    return 1;
  }
}

async function uploadAwardData(award) {
  try {
    const response = await fetch(
      `${MIDDLEWARE_BASE_URL}${SOCCER_PATH}${AWARDS_PATH}`,
      {
        method: 'post',
        body: JSON.stringify(award),
        headers: {'Content-Type': 'application/json'}
      }
    );

    if (response.ok) {
      console.log(`Successfully uploaded award: ${JSON.stringify(award)}`);
    } else {
      console.log(`Error uploading award data: ${response.status}`);
    }
  } catch (error) {
    console.log(`Error uploading award data: ${error}`);
  }
}
