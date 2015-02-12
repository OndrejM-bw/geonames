  function startApp() {
    $(document).ready(function() {
      var geonames = newGeonames();
      var app = newApp(geonames);
      
      app.start();
      window.app = app;
    });
  }

  function initialize() {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }
  
  function newGeonames() {
    return {
      username: "mihalyi.bw",
      getLocations: function(name, callback) {
        $.getJSON("http://api.geonames.org/searchJSON?username=" + this.username + "&name_equals=" + name + "&style=FULL", callback);
      },
      getEarthquakes: function(locations, callback) {
        var i = 0; 
        var result = [];
        var self = this;
        var retrieveData = function(data) {
          if (data !== undefined) {
            result = result.concat(data.earthquakes);
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
      }
    };
  }
  
  function newApp(geonames) {
    return {
      geonames: geonames,
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
          self.searchResults = data.geonames;
        });
      }
    };
  }