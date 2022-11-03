const fs = require("fs");
const prompt = require("prompt-sync")({sigint: true})
const { parse } = require("csv-parse");
const { stringify } = require('csv-stringify');
let crypto = require("crypto");

let filename = prompt("Enter filename: ");

let writableStream = fs.createWriteStream(`${filename}.output.csv`);
const columns = [
  "Series Number",
  "Filename",
  "Description",
  "Gender",
  "Hash",
]


fs.createReadStream(`./csv/NFT Naming csv - Team ${filename}.csv`)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
      let result = {
        format: "CHIP-007",
        sensitive_content: false,
        description: row[2],
        filename: row[1],
        series_number: row[0],
        series_total: 20,
        gender: row[3],
        hash: crypto.createHash('sha256').update(row[0], 'utf-8').digest('hex'),
      };
      console.log(JSON.stringify(result));
      const stringifier = stringify({ header: true, columns: columns});
      stringifier.write({
        "Series Number": result?.series_number,
        "Filename": result?.filename,
        "Description": result?.description,
        "Gender": result?.gender,
        "Hash": result.hash
      });
      stringifier.pipe(writableStream);
      console.log("Finished writing data");
      
  })
  .on("end", function () {
    console.log("finished generating json");
  })
  .on("error", function (error) {
    console.log(error.message);
  });