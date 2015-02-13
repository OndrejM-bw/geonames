  function startApp() {
    $(document).ready(function() {
      var geonames = newGeonames();
      var app = newApp(geonames, initialize);
      
      app.start();
      window.app = app;
    });
  }

  var mapInitialized = false;
  var map;

  function initialize() {
    if ( ! mapInitialized) {
      var mapElem = $('#map-canvas');
      mapElem.first().each(function(i, elem) {
        var mapOptions = {
          center: { lat: -34.397, lng: 150.644},
          zoom: 8
        };
        map = new google.maps.Map(elem, mapOptions);
        $(elem).show();
      });
      mapInitialized = true;
    }
    return map;
  }
  
  function newGeonames() {
    return {
      username: "mihalyi.bw",
      getLocations: function(name, callback) {
        $.getJSON("http://api.geonames.org/searchJSON?username=" + this.username + "&name_equals=" + name + "&style=FULL", callback);
      },
      getEarthquakes: function(loc, callback) {
        if (loc instanceof Array) {
          this._getEarthquakesForArray(loc, callback);
        } else {
          this._getEarthquakesForSingleLoc(loc, callback);
        }
      },
      _getEarthquakesForArray: function(locations, callback) {
        var i = 0; 
        var result = [];
        var self = this;
        var retrieveData = function(data) {
          if (data !== undefined) {
            result = result.concat(data.earthquakes);
          }
          while ( i < locations.length && locations[i].bbox === undefined) {
            i++;
          }
          if (i < locations.length) {
            // asynchronous loop for i = 0 to locations.length
            var loc = locations[i].bbox;
            $.getJSON("http://api.geonames.org/earthquakesJSON?username=" + self.username 
              + "&east=" + loc.east  + "&south=" + loc.south  + "&north=" + loc.north  + "&west=" + loc.west, retrieveData);
            i++;
          } else {
            // continue after loop
            callback(result);
          }
        };
        
        retrieveData();
      },
      _getEarthquakesForSingleLoc: function(location, callback) {
        if (location.bbox === undefined) {
          setTimeout(function() {
            callback([]);
          },0);
        } else {
            var loc = location.bbox;
            $.getJSON("http://api.geonames.org/earthquakesJSON?username=" + this.username 
              + "&east=" + loc.east  + "&south=" + loc.south  + "&north=" + loc.north  + "&west=" + loc.west, function(data) {
                callback(data.earthquakes);
              });
        }
      }
    };
  }
  
  function newApp(geonames, mapInitializer) {
    return {
      geonames: geonames,
      mapInitializer: mapInitializer,
      getSearchButton: function() {
        return $("#searchButton");
      },
      getLocation: function() {
        return $("#location").val();
      },
      start: function() {
        var self = this;
        this.getSearchButton().click(function(e) {
          e.preventDefault();
          self.search(self.getLocation());
        })
      },
      search: function(location) {
        var self = this;
        this.geonames.getLocations(location, function(data) {
          var locations = data.geonames;
          self.searchResults = locations;  // necessary for test, could be removed
          
          for (var i = 0; i < locations.length; i++) {
              self.geonames.getEarthquakes(locations[i], function(earthquakes) {
                self._displayEarthquakesOnMap(earthquakes);
              });
          }

        });
      },
      _displayEarthquakesOnMap: function(earthquakes) {
        var map = this.mapInitializer();
        for (var i = 0; i < earthquakes.length; i++) {
            var eq = earthquakes[i];
            var eqCoords = { lat: eq.lat, lng: eq.lng};
            map.setCenter(eqCoords);
            var marker = new google.maps.Marker({
              position: eqCoords,
              map: map,
              title: "Happened on " + eq.datetime + " at magnitude " + eq.magnitude
            });
        }
      }
    };
  }