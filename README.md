# OyStars-Scripts

Scripts to help with data management for the Oystars Stats apps and middleware.

# Scripts and Usage
## Parse Players CSV
This script parses a table of players statistics in csv format with a header row and uploads the data to dynamoDB via the Oystars-Middleware APIs

Usage is `node scripts/parsePlayersCsv.js file={full file name}`

example csv file: [example/example_soccer_players.csv](https://github.com/backer/OyStars-Scripts/blob/b27ebce25ce286245a703f40d619dc841b7321d5/example/example_soccer_players.csv)

## Upload Season Data
This script accepts year, session number, team W-L-D record, and players csv file to parse and upload the resulting data to dynamoDB via the OyStars-Middleware APIs. <br>
The file argument should be a csv with just the list of players with fields: name, goals, assists, clean_sheet_halves

Usage is `node scripts/uploadSeasonData year={year} session={session number} record={team W-L-D record} file={players stats csv full file path}`

example csv file: [example/example_soccer_season_stats.csv](https://github.com/backer/OyStars-Scripts/blob/b27ebce25ce286245a703f40d619dc841b7321d5/example/example_soccer_season_stats.csv)

## Upload Soccer Award Data
This script accepts award name and award winners csv file to parse and upload the resulting data to dynamoDB via the OyStars-Middleware APIs. <br>
The file argument should be a csv with the list of award winners with fields: year, session, name, goals, assists

Usage is `node scripts/uploadSoccerAward award={award name} file={award winners csv full file path}`

example csv file: [example/example_soccer_awards.csv](https://github.com/backer/OyStars-Scripts/blob/ac8449876b9ddc726cd54e6d2afd73bab25f88f8/example/example_soccer_awards.csv)

## Upload Football Game Data
This script accepts season id, result (w/l/d), team_score, opponent_score, opponent_name, and players csv file to parse and upload the resulting data to dynamoDB via the OyStars-Middleware APIs. This script adds a game to an existing season and updates season totals

The file argument should be a csv with just the list of players with fields for each football stats field, matching the format of either example/football_game_with_yards_and_rushing.csv or example/football_game_scoring_plays_only.csv

If rushing is included, it will be combined with the receiving stats as we no longer record rushing and have very little existing rushing stats.

Usage is `node uploadFootballGame.js season_id=<season id> result=<w/l/d> team_score=<points scored by OyStars> opponent_score=<points scored by opponent> opponent_name=<team name of opponent> file=<full file path to player stats csv>`

## Upload Football Award Data
This script accepts award name and award winners csv file to parse and upload the resulting data to dynamoDB via the OyStars-Middleware APIs. <br>
The file argument should be a csv with the list of award winners with fields: session, year, name, notable_stats

Usage is `node scripts/uploadFootballAward award={award name} file={award winners csv full file path}`

example csv file: [example/example_football_awards.csv](https://github.com/backer/OyStars-Scripts/blob/ac8449876b9ddc726cd54e6d2afd73bab25f88f8/example/example_football_awards.csv)
