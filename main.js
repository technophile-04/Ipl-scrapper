const cheerio = require('cheerio');
const request = require('request');
const fetchAllScrData = require('./scorecard.js');
const fs = require('fs');
const path = require('path');
const url = 'https://www.espncricinfo.com/series/ipl-2021-1249214';

request(url, (err, res, body) => {
	if (err) {
		console.log('Error', err);
	} else {
		handleBodyHtml(body);
	}
});

function handleBodyHtml(body) {
	const $ = cheerio.load(body);
	// const resultEle = $('a[data-hover="View All Fixtures"]');
	// const anchorLink = $(resultEle).attr('href');
	// const resultsLink = '/series/ipl-2021-1249214/match-results';
	// const fullLink = 'https://www.espncricinfo.com' + resultsLink;
	getAllMatchesLink(
		'https://www.espncricinfo.com/series/ipl-2021-1249214/match-results'
	);
}

const iplPath = path.join(__dirname, 'ipl');
dirCreator(iplPath);

function getAllMatchesLink(link) {
	request(link, (err, res, body) => {
		if (err) {
			console.log('Error', err);
		} else {
			extractLink(body);
		}
	});
}

function extractLink(body) {
	const $ = cheerio.load(body);

	const scrCardLinkElements = $('a[data-hover="Scorecard"]');

	for (let i = 0; i < scrCardLinkElements.length; i++) {
		let scrCarLink = $(scrCardLinkElements[i]).attr('href');
		let fullLink = 'https://www.espncricinfo.com' + scrCarLink;
		fetchAllScrData(fullLink);
	}
}

function dirCreator(filePath) {
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}
}
