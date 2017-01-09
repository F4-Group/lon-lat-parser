/*globals it, describe */
var should = require('should');
var parser = require('../lon-lat-parser');

describe('lon-lat-parser', function () {
    test("43.6426, -79.3871", 43.6426, -79.3871);
    test("43.6426 / -79.3871", 43.6426, -79.3871);
    test("43.6426 , -79.3871", 43.6426, -79.3871);
    test("43.6426°N 79.3871°W", 43.6426, -79.3871);
    test("47.215734 N 1.5541635 W", 47.215734, -1.5541635);
    test("23° 6′ 32″ N, 113° 19′ 8″ E", 23.10888888888889, 113.31888888888888);
    test("48° 51′ 24″ Nord 2° 21′ 07″ Est", 48.85666666666667, 2.3519444444444444);
    test("25°11′49.7″N 55°16′26.8″E", 25.19713888888889, 55.27411111111111);
    test("47°12'1.00 N 1°34'26.17 W", 47.20027777777778, -1.5739361111111112);
    test("47 12'1.00 N 1 34'26.17 W", 47.20027777777778, -1.5739361111111112);
    test("47°12.275’N / 1°42.599 W", 47.20458333333333, -1.7099833333333332);
    test("N 48° 20' 54,5  W 02° 00' 41,9", 48.34847222222223, -2.0116388888888888);
    test("N 47° 56,339' - W 4° 09,097'", 47.93898333333333, -4.1516166666666665);
    test("47° 10′ 10.45″ N, 2° 12′ 16.75″ E", 47.16956944444444, 2.204652777777778);
    test("47° 10′ 10,45″ N, 2° 12′ 16,75″ E", 47.16956944444444, 2.204652777777778);

    test("foo, bar", null);
});

function test(text, expectedLat, expectedLon) {
    it('should parse ' + text, function () {
        var result = parser(text);
        if (expectedLat) {
            should.exist(result);
            should.exist(result.lat);
            should.exist(result.lon);
            result.lat.should.equal(expectedLat);
            result.lon.should.equal(expectedLon);
        } else {
            should.not.exist(result);
        }
    });
}
