#!/usr/bin/env node

console.log("Test script starting.");
const [, , ...args] = process.argv;
// const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csv-parse");
const path = require("path");

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

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', function(data){
      try {
        console.log(`Name is: ${data.name}`);
        console.log(`goals is ${data.goals}`);
        console.log(`assists is ${data.assists}`);
        console.log(`number is ${data.number}`);

        //perform the operation
      }
      catch(err) {
        //error handler
        console.log(`Error parsing csv data: ${err}`);
      }
    })
    .on('end',function(){
      //some final operation
      console.log(`csv parsing finished`);
    }); 
  } else {
    console.log(`Error: file path is null or empty`);
    return 1;
  }
}
