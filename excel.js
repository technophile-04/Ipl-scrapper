const xlsx = require('xlsx');
const fs = require('fs');

//? Writtin in xlsx
/* const newWb = xlsx.utils.book_new();
const newWS = xlsx.utils.json_to_sheet(jsonData);
xlsx.utils.book_append_sheet(newWb, newWS, 'sheet-1');
xlsx.writeFile(newWb, 'abc.xlsx'); */

//?Reading in xlsx
/* const wb = xlsx.readFile('abc.xlsx');
const excelData = wb.Sheets['sheet-1'];
const ans = xlsx.utils.sheet_to_json(excelData);
console.log(ans); */

function excelWritter(filePath, jsonData, sheetName) {
	const newWb = xlsx.utils.book_new();
	const newWS = xlsx.utils.json_to_sheet(jsonData);
	xlsx.utils.book_append_sheet(newWb, newWS, sheetName);
	xlsx.writeFile(newWb, filePath);
}

function excelReader(filePath, sheetName) {
	if (!fs.existsSync(filePath)) {
		return [];
	}

	const wb = xlsx.readFile(filePath);
	const excelData = wb.Sheets[sheetName];
	const ans = xlsx.utils.sheet_to_json(excelData);
	return ans;
}

module.exports = { excelReader, excelWritter };
