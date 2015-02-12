  function initialize() {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }
  
  $(document).ready(function() {
    var geonames = {
      username: "mihalyi.bw",
      getLocations: function(name, callback) {
        $.getJSON("http://api.geonames.org/searchJSON?username=" + this.username + "&name_equals=" + name + "&style=FULL", callback);
      }
    }
    
    var app = {
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
        geonames.getLocations(location, function(data) {
          console.log(data);
          self.searchResults = data.geonames;
        });
      }
    };
    
    app.start();
    window.app = app;
  });