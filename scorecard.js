const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const path = require('path');
const { excelReader, excelWritter } = require('./excel');

function fetchAllScrData(url) {
	request(url, (err, res, body) => {
		if (err) {
			console.log('Error', err);
		} else {
			extractMatchDetails(body);
		}
	});
}

function extractMatchDetails(body) {
	const $ = cheerio.load(body);

	const dec = $('.header-info .description').text();

	const result = $(
		'.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text'
	).text();

	let matchDescArr = dec.split(',');
	const venue = matchDescArr[1].trim();
	const date = matchDescArr[2].trim();

	let innings = $('.card.content-block.match-scorecard-table>.Collapsible');

	for (let i = 0; i < innings.length; i++) {
		const teamName = $(innings[i])
			.find('.header-title.label')
			.text()
			.split('INNINGS')[0]
			.trim();

		const oppentIndex = i === 0 ? 1 : 0;

		const oppentTeamName = $(innings[oppentIndex])
			.find('.header-title.label')
			.text()
			.split('INNINGS')[0]
			.trim();

		const allRows = $(innings[i]).find('.table.batsman tbody tr');

		for (let j = 0; j < allRows.length; j++) {
			let allCol = $(allRows[j]).find('td');

			if ($(allCol[0]).hasClass('batsman-cell')) {
				let playerName = $(allCol[0]).text().trim();
				let runs = $(allCol[2]).text().trim();
				let balls = $(allCol[3]).text().trim();
				let fours = $(allCol[5]).text().trim();
				let sixes = $(allCol[6]).text().trim();
				let sr = $(allCol[7]).text().trim();

				console.log(
					`${playerName} scored ${runs} in ${balls} balls with number of fours ${fours} and ${sixes} sixes and strike rate was ${sr}`
				);

				makeExcel(
					teamName,
					oppentTeamName,
					venue,
					date,
					playerName,
					runs,
					balls,
					fours,
					sixes,
					sr
				);
			}
		}
	}

	console.log(result);
	console.log(
		'-------------------------------------------------------------------------------------------------------------'
	);
}

function makeExcel(
	teamName,
	oppentTeamName,
	venue,
	date,
	playerName,
	runs,
	balls,
	fours,
	sixes,
	sr
) {
	const teamPath = path.join(__dirname, 'ipl', teamName);
	dirCreator(teamPath);
	const filePath = path.join(teamPath, playerName + '.xlsx');
	const data = excelReader(filePath, playerName);
	let playerObj = {
		'Team Name': teamName,
		'Player Name': playerName,
		Runs: runs,
		Balls: balls,
		Fours: fours,
		Sixes: sixes,
		'Strike Rate': sr,
		'Opponent Team': oppentTeamName,
		Venue: venue,
		Date: date,
	};

	data.push(playerObj);

	excelWritter(filePath, data, playerName);
}

function dirCreator(filePath) {
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}
}

module.exports = fetchAllScrData;
