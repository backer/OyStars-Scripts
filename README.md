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
