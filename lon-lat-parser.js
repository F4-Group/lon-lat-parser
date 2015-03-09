var _ = require('underscore');

module.exports = function (text) {
    var cleanText = text
        .replace(/(\d+)\s+(\d+)/g, '$1_$2') // keeps spaces only between digits
        .replace(/\s/g, '')
        .replace(/_/g, ' ');
    var lat, lon;
    // examples:
    // - 43.6426, -79.3871
    // - 43,6426 / -79,3871
    // - 43,6426 , -79,3871
    var ddMatch = /^([-+]?\d+(?:[.,]\d+)?)[,/]([-+]?\d+(?:[.,]\d+))?$/.exec(cleanText);
    if (ddMatch) {
        lat = parseFrenchOrEnglishFloat(ddMatch[1]);
        lon = parseFrenchOrEnglishFloat(ddMatch[2]);
        return {lon: lon, lat: lat};
    }
    // examples:
    // - 43.6426°N 79.3871°W
    // - 47.215734 N 1.5541635 W
    var ddMatch2 = /^(\d+(?:\.\d+)?)°?([NS]),?(\d+(?:\.\d+)?)°?([EWO])$/i.exec(cleanText);
    if (ddMatch2) {
        lat = parseFloat(ddMatch2[1]);
        if (/[s]/i.test(ddMatch2[2]))
            lat = -lat;
        lon = parseFloat(ddMatch2[3]);
        if (/[ow]/i.test(ddMatch2[4]))
            lon = -lon;
        return {lon: lon, lat: lat};
    }
    // examples:
    // - 23° 6′ 32″ N, 113° 19′ 8″ E
    // - 48° 51′ 24″ Nord 2° 21′ 07″ Est
    // - 25°11′49.7″N 55°16′26.8″E
    // - 47°12'1.00 N 1°34'26.17 W
    // - 47 12'1.00 N 1 34'26.17 W
    var dmsMatch = /^(\d+)[° ](\d+)[’′'](\d+(?:\.\d+)?)[″"]?([NS])(?:ord|ud|orth|outh)?[,/]?(\d+)[° ](\d+)[’′'](\d+(?:\.\d+)?)[″"]?([EWO])(?:st|ast|est|uest)?$/i.exec(cleanText);
    if (dmsMatch) {
        lat = convertDMSToDD(dmsMatch[1], dmsMatch[2], dmsMatch[3], dmsMatch[4]);
        lon = convertDMSToDD(dmsMatch[5], dmsMatch[6], dmsMatch[7], dmsMatch[8]);
        return {lon: lon, lat: lat};
    }

    // examples:
    // - 47°12.275’N / 1°42.599 W
    var dmsMatch2 = /^(\d+)°(\d+(?:\.\d+)?)[’′']?([NS])(?:ord|ud|orth|outh)?[,/]?(\d+)°(\d+(?:\.\d+)?)[’′']?([EWO])(?:st|ast|est|uest)?$/i.exec(cleanText);
    if (dmsMatch2) {
        lat = convertDMSToDD(dmsMatch2[1], dmsMatch2[2], 0, dmsMatch2[3]);
        lon = convertDMSToDD(dmsMatch2[4], dmsMatch2[5], 0, dmsMatch2[6]);
        return {lon: lon, lat: lat};
    }

    // examples:
    // - N 48° 20' 54,5  W 02° 00' 41,9
    var dmsMatch3 = /^([NS])(?:ord|ud|orth|outh)?(\d+)°(\d+)[’′'](\d+(?:[.,]\d+)?)[″"]?([EWO])(?:st|ast|est|uest)?(\d+)°(\d+)[’′'](\d+(?:[.,]\d+)?)[″"]?$/i.exec(cleanText);
    if (dmsMatch3) {
        lat = convertDMSToDD(dmsMatch3[2], dmsMatch3[3], dmsMatch3[4], dmsMatch3[1]);
        lon = convertDMSToDD(dmsMatch3[6], dmsMatch3[7], dmsMatch3[8], dmsMatch3[5]);
        return {lon: lon, lat: lat};
    }

    // examples:
    // - N 47° 56,339' - W 4° 09,097'
    var dmsMatch4 = /^([NS])(?:ord|ud|orth|outh)?(\d+)°(\d+(?:[.,]\d+)?)[’′']?[-/]([EWO])(?:st|ast|est|uest)?(\d+)°(\d+(?:[.,]\d+)?)[’′']?$/i.exec(cleanText);
    if (dmsMatch4) {
        lat = convertDMSToDD(dmsMatch4[2], dmsMatch4[3], 0, dmsMatch4[1]);
        lon = convertDMSToDD(dmsMatch4[5], dmsMatch4[6], 0, dmsMatch4[4]);
        return {lon: lon, lat: lat};
    }

    return null;
};

function parseFrenchOrEnglishFloat(s) {
    var num = s;
    if (!_.isNumber(num))
        num = parseFloat(s.replace(',', '.'));
    return num;
}

//day/minutes/seconds to decimal degree
function convertDMSToDD(days, minutes, seconds, direction) {
    var dd = parseFrenchOrEnglishFloat(days) + parseFrenchOrEnglishFloat(minutes) / 60
        + parseFrenchOrEnglishFloat(seconds) / (60 * 60);
    if (/[swo]/i.test(direction))
        dd = -dd;
    return dd;
}