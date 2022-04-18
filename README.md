# OyStars-Scripts

Scripts to help with data management for the Oystars Stats apps and middleware.

# Scripts and Usage
## Parse Players CSV
This script parses a table of players statistics in csv format with a header row and uploads the data to dynamoDB via the Oystars-Middleware APIs

Usage is `node scripts/parsePlayersCsv.js file={full file name}`

## Upload Season Data
This script accepts year, session number, team W-L-D record, and players csv file to parse and upload the resulting data to dynamoDB via the OyStars-Middleware APIs. <br>
The file argument should be a csv with just the list of players with fields: name, goals, assists, clean_sheet_halves

Usage is `node scripts/uploadSeasonData year={year} session={session number} record={team W-L-D record} file={players stats csv full file path}`
