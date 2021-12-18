const V1 = require("./music-generatorV1.js");
const V2 = require("./music-generatorV2.js");
const V3 = require("./music-generatorV3.js");
const V4 = require("./music-generatorV4.js");

console.log("PROUT");

module.exports.generate = V1.generate;
module.exports.generateV2 = V2.generateV2;
module.exports.generateV3 = V3.generateV3;
module.exports.generateV4 = V4.generateV4;