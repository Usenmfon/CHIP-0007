const fs = require("fs");
const prompt = require("prompt-sync")({sigint: true})
const { parse } = require("csv-parse");
const { stringify } = require('csv-stringify');
let crypto = require("crypto");
const { EventEmitter } = require("stream");
const csv = require('csv-parser');

EventEmitter.setMaxListeners(20);

let writableStream = fs.createWriteStream("teams.output.csv");

const columns = [
  "Series Number",
  "Filename",
  "Description",
  "Gender",
  "Hash",
]

fs.createReadStream("./csv/HNGi9 CSV FILE - Sheet1.csv")
  .pipe(csv())
  .on("data", function (row) {
      let result = {
        format: "CHIP-007",
        sensitive_content: false,
        description: row["Description"],
        filename: row["Filename"],
        series_number: row["Series Number"],
        series_total: 420,
        gender: row["Gender"],
        collection: {
          name: "Zuri NFT Tickets for Free Lunch",
          id: "xch1c8zmlhue3f0g88y5g0efd59pptsjelvef7dnu7s6ga3v8zg2xysstvs4um",
        }
      };

      let str = row["Attributes"];
      let splitStr = str.split(';');

      result.attributes = [];
      for(let i = 0; i < splitStr.length; i++){
      let value = splitStr[i].split(':');
      let key = value[0].trim();
      let data = value[1]?.trim();
      result.attributes.push({"trait_type": key, value: data})
      }

      let generatedJson = JSON.stringify(result);

      result.hash = crypto.createHash('sha256').update(generatedJson, 'utf-8').digest('hex');

      console.log(JSON.stringify(result));

      generateCsv(result)   
  })
  .on("end", function () {
    console.log("finished generating json");
  })
  .on("error", function (error) {
    console.log(error.message);
  });

 
  function generateCsv(data){
    let stringifier = stringify({ header: true, columns: columns});
      stringifier.write({
        "Series Number": data?.series_number,
        "Filename": data?.filename,
        "Description": data?.description,
        "Gender": data?.gender,
        "Hash": data.hash
      });
      stringifier.pipe(writableStream);
      console.log("Finished writing data");
  }