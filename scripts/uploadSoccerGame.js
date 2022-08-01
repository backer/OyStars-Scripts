#!/usr/bin/env node

const [, , ...args] = process.argv;
const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csv-parse");
const path = require("path");

const MIDDLEWARE_BASE_URL = `https://5c75f3ks0k.execute-api.us-east-1.amazonaws.com`;
const SOCCER_PATH = `/soccer`;
const SEASONS_PATH = `/seasons`;
const GAMES_PATH = '/games';

const ARGS = {
  file: "file=",
  season_id: 'season_id=',
  result: 'result=',
  team_score: 'team_score=',
  opponent_score: 'opponent_score=',
  opponent_name: 'opponent_name='
};

const USAGE_MESSAGES = {
  file: `node ${path.basename(__filename)} ${ARGS.season_id}<season id> ${ARGS.result}<w/l/d> ${ARGS.team_score}<points scored by OyStars> ${ARGS.opponent_score}<points scored by opponent> ${ARGS.opponent_name}<team name of opponent> ${ARGS.file}<full file path to player stats csv>`,
}
const GENERAL_USAGE_MESSAGE = `Usage: '${USAGE_MESSAGES.file}'`;

if (args.length < ARGS.length) {
  console.log(
    `Error: Not enough arguments. ${GENERAL_USAGE_MESSAGE}`
  );
} else {
  var source;
  var season_id;
  var result;
  var team_score;
  var opponent_score;
  var opponent_name;

  args.forEach(arg => {
    if (arg.includes(ARGS.file)) {
      source = arg.replace(ARGS.file, "");
    } else if (arg.includes(ARGS.season_id)) {
      season_id = arg.replace(ARGS.season_id, "");
    } else if (arg.includes(ARGS.result)) {
      result = arg.replace(ARGS.result, "");
    } else if (arg.includes(ARGS.team_score)) {
      team_score = arg.replace(ARGS.team_score, "");
    } else if (arg.includes(ARGS.opponent_score)) {
      opponent_score = arg.replace(ARGS.opponent_score, "");
    } else if (arg.includes(ARGS.opponent_name)) {
      opponent_name = arg.replace(ARGS.opponent_name, "");
    }
  });

  if (source && season_id) {
    parseCsvFile(source, season_id, result, team_score, opponent_score, opponent_name);
  } else {
    console.log(
      `Error: invalid arguments. ${GENERAL_USAGE_MESSAGE}`
    );
  }
}

function parseCsvFile(file, season_id, result, team_score, opponent_score, opponent_name) {
  if (file && file.length > 0) {
    const fs = require('fs'); 
    const csv = require('csv-parser');

    // players is map of name to player instead of array in season structure
    var players = {};

    fs.createReadStream(file)
      .pipe(csv())
      .on('data', function(data){
      try {
        var soccerStatsFields = [
          'goals',
          'assists',
          'clean_sheet_halves'
        ];

        var player = {
          'name': data.name,
        };
        soccerStatsFields.forEach(field => {
          player[field] = data[field] ? parseFloat(data[field]) : 0;
        });

        console.log(`Parsed player data: ${JSON.stringify(player)}`);

        players[player.name] = player;
      }
      catch(err) {
        console.log(`Error parsing csv data: ${err}`);
      }
    })
    .on('end',function(){
      console.log(`csv parsing finished, uploading game data`);

      // create game object for upload
      const game = {
        'season_id': season_id,
        'result': result ?? "",
        'team_score': team_score ? parseInt(team_score) : 0,
        'opponent_score': opponent_score ? parseInt(opponent_score) : 0,
        'opponent_name': opponent_name ?? "",
        'players': players
      }
      uploadGameData(game);
    }); 
  } else {
    console.log(`Error: file path is null or empty`);
    return 1;
  }
}

async function uploadGameData(game) {
  try {
    const response = await fetch(
      `${MIDDLEWARE_BASE_URL}${SOCCER_PATH}${SEASONS_PATH}/${game.season_id}${GAMES_PATH}`,
      {
        method: 'post',
        body: JSON.stringify(game),
        headers: {'Content-Type': 'application/json'}
      }
    );

    if (response.ok) {
      console.log(`Successfully uploaded game: ${JSON.stringify(game)}`);
    } else {
      console.log(`Error uploading game data: ${response.status}`);
    }
  } catch (error) {
    console.log(`Error uploading game data: ${error}`);
  }
}
