enhanceLanguage();

QUnit.test( "B1: search page is displayed", function( assert ) {
    openInitialPage(assert, function (done) {
        assert.ok( appFrame().hasSearchButton(), "Has search button" );
        assert.ok( appFrame().hasLocationInput(), "Has location field");
        done();
    });
    
});

QUnit.test( "B3: search by location retrieves coordinates", function( assert ) {
    openInitialPage(assert, function (done) {
        appFrame().setLocationValue("Los Angeles");
        appFrame().submitSearch();
        var searchFinished = function() {
           return appFrame().getWindow().app.searchResults && appFrame().getWindow().app.searchResults.length > 0;
        }
        waitForCondition(searchFinished, function() {
            assert.ok(searchFinished(), "Search finished ok with some results");
            done();
        });
    });
});

QUnit.test( "B3: geonames retrieves coordinates for location", function( assert ) {
    var location = "Los Angeles";
    var geonames = newGeonames();
    var done = assert.async();
    geonames.getLocations(location, function(locations) {
        assert.ok(locations.totalResultsCount > 0, "Total results is bigger that 0");
        assert.ok(locations.geonames.length > 0, "Number of records found bigger than 0");
        assert.ok(locations.geonames[0].name.startsWith("Los"), "Record names start with Los");
        done();
    });
});

QUnit.test("B4: from list of locations find earthquakes", function(assert) {
    var locations = getSampleLocationQueryResult();
    var geonames = newGeonames();
    var done = assert.async();
    geonames.getEarthquakes(locations, function(earthquakes) {
        assert.notEqual(undefined, earthquakes, "Earthquakes should be filled");
        assert.notEqual(earthquakes.length, 0, "Earthquakes should contain some elements");
        assert.notEqual(undefined, earthquakes[0].datetime, "Earthquake record should contain datetime");
        assert.notEqual(undefined, earthquakes[0].lng, "Earthquake record should contain longitude");
        assert.notEqual(undefined, earthquakes[0].lat, "Earthquake record should contain latitude");
        assert.notEqual(undefined, earthquakes[0].magnitude, "Earthquake record should contain magnitude");
        done();
    });
});

QUnit.test("B4: from list of locations find earthquakes - asynchronous way", function(assert) {
    var locations = getSampleLocationQueryResult();
    var geonames = newGeonames();
    var done = assert.async();
    var earthquakes = [];
    var runningQueries = 0;

    for (var i = 0; i < locations.length; i++) {
        runningQueries++;
        geonames.getEarthquakes(locations[i], function(earthquakesPart) {
            earthquakes = earthquakes.concat(earthquakesPart);
            runningQueries--;
        });
    }
    waitForCondition(function() {return runningQueries <= 0;}, function() {
        assert.equal(0, runningQueries, "No running queries expected");
        assert.notEqual(undefined, earthquakes, "Earthquakes should be filled");
        assert.notEqual(0, earthquakes.length, "Earthquakes should contain some elements");
        assert.notEqual(undefined, earthquakes[0].datetime, "Earthquake record should contain datetime");
        assert.notEqual(undefined, earthquakes[0].lng, "Earthquake record should contain longitude");
        assert.notEqual(undefined, earthquakes[0].lat, "Earthquake record should contain latitude");
        assert.notEqual(undefined, earthquakes[0].magnitude, "Earthquake record should contain magnitude");
        done();
    }, 30);

});

QUnit.test( "B5: display markers for earthquakes", function( assert ) {
    openInitialPage(assert, function (done) {
        assert.ok(false, "To do...");
        done();
    });
});


/* helper functions
===============================
*/

function waitForCondition(conditionEvaluator, callback, timeoutInSeconds) {
    var retryCount = 100;
    if (timeoutInSeconds !== undefined) {
        retryCount = timeoutInSeconds * 10;
    }
    var waitIfNotMet = function() {
        setTimeout(function() {
            if (conditionEvaluator()) {
                callback(true);
            } else {
                if (retryCount > 0) {
                    retryCount--;
                    waitIfNotMet();
                } else {
                    callback(false);
                }
            }
        }, 100);
    };
    
    waitIfNotMet();
}

function openInitialPage(assert, callback) {
    var done = assert.async();
    $("#qunit-fixture").html();
    var iframe = document.createElement('iframe');
    iframe.addEventListener('load', function(){ callback(done); });
    iframe.id="appframe";
    iframe.src = "app.html";
    $("#qunit-fixture")[0].appendChild(iframe);
}

function appFrame() {
    return {
        elem: $("#appframe"),
        getSearchButton: function() {
            return this.elem.contents().find("#searchButton");
        },
        hasSearchButton: function() {
            return this.getSearchButton().length > 0;
        },
        hasLocationInput: function() {
            return this.getLocationElem().length > 0;
        },
        getLocationElem: function() {
            return this.elem.contents().find("#location");
        },
        setLocationValue: function(value) {
            this.getLocationElem().val(value);
        },
        submitSearch: function() {
            this.getSearchButton().click();
        },
        getWindow: function() {
            return this.elem[0].contentWindow || this.elem[0];
        }

    };
}

function enhanceLanguage() {
    if (typeof String.prototype.startsWith != 'function') {
      // see below for better implementation!
      String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
      };
    }
}

function getSampleLocationQueryResult() {
    return  [{"timezone":{"gmtOffset":-8,"timeZoneId":"America/Los_Angeles","dstOffset":-7},
              "bbox":{"east":-118.155289,"south":33.703652,"north":34.337306,"west":-118.668176},
              "asciiName":"Los Angeles","countryId":"6252001","fcl":"P","score":142.10707092285156,
              "adminId2":"5368381","countryCode":"US","adminId1":"5332921","lat":"34.05223",
              "fcode":"PPLA2","continentCode":"NA","elevation":89,"adminCode2":"037","adminCode1":"CA",
              "lng":"-118.24368","geonameId":5368361,"toponymName":"Los Angeles","population":3792621,
              "adminName5":"","adminName4":"","adminName3":"",
              "alternateNames":[{"name":"Лос-Анџелес","lang":"ab"},{"name":"Los Angeles","lang":"af"}],
              "adminName2":"Los Angeles County","name":"Los Angeles","fclName":"city, village,...",
              "countryName":"United States","fcodeName":"seat of a second-order administrative division","adminName1":"California"},
             {"timezone":{"gmtOffset":-3,"timeZoneId":"America/Santiago","dstOffset":-4},
              "bbox":{"east":-72.29591207801225,"south":-37.51559079048527,"north":-37.42387320951473,"west":-72.41140192198775},
              "asciiName":"Los Angeles","countryId":"3895114","fcl":"P","score":62.03242874145508,"adminId2":"3898381","adminId3":"8261144",
              "countryCode":"CL","adminId1":"3898380","lat":"-37.46973","fcode":"PPL","continentCode":"SA",
              "adminCode2":"83","adminCode3":"08301","adminCode1":"06","lng":"-72.35366","geonameId":3882428,
              "toponymName":"Los Ángeles","population":125430,"adminName5":"","adminName4":"","adminName3":"Los Angeles",
              "alternateNames":[{"name":"Los Anceles","lang":"az"},{"name":"לוס אנחלס","lang":"he"}],
              "adminName2":"Provincia de Biobío","name":"Los Ángeles","fclName":"city, village,...","countryName":"Chile",
              "fcodeName":"populated place","adminName1":"Biobío"},
             {"timezone":{"gmtOffset":-3,"timeZoneId":"America/Argentina/Catamarca","dstOffset":-3},
              "bbox":{"east":-65.97310197500876,"south":-28.492326948751757,"north":-28.474339651248247,"west":-65.99356462499124},
              "asciiName":"Los Angeles","countryId":"3865483","fcl":"P","score":55.483489990234375,"countryCode":"AR","adminId1":"3862286",
              "lat":"-28.48333","fcode":"PPL","continentCode":"SA","adminCode1":"02","lng":"-65.98333","geonameId":3846493,"toponymName":"Los Ángeles",
              "population":0,"adminName5":"","adminName4":"","adminName3":"",
              "alternateNames":[{"name":"http://en.wikipedia.org/wiki/Los_%C3%81ngeles%2C_Catamarca","lang":"link"}],
              "adminName2":"","name":"Los Ángeles","fclName":"city, village,...","countryName":"Argentina","fcodeName":"populated place",
              "adminName1":"Catamarca"},
             {"timezone":{"gmtOffset":-3,"timeZoneId":"America/Santiago","dstOffset":-4},
/*              "bbox":{"east":-72.04075959667718,"south":-37.66292455727078,"north":-37.17850689958166,"west":-72.68447087071509},   - intentionally removed, sometimes may happen that it is missing */ 
              "asciiName":"Los Angeles","countryId":"3895114","fcl":"A","score":54.92584991455078,"adminId2":"3898381","adminId3":"8261144","countryCode":"CL",
              "adminId1":"3898380","lat":"-37.40792","fcode":"ADM3","continentCode":"SA","adminCode2":"83","adminCode3":"08301","adminCode1":"06","lng":"-72.32774",
              "geonameId":8261144,"toponymName":"Los Angeles","population":0,"adminName5":"","adminName4":"","adminName3":"Los Angeles","adminName2":"Provincia de Biobío",
              "name":"Los Angeles","fclName":"country, state, region,...","countryName":"Chile","fcodeName":"third-order administrative division","adminName1":"Biobío"}
            ];
}

