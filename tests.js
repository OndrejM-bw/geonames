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
        setTimeout(function() {
            assert.ok(appFrame().getWindow().app.searchResults.length > 0);
            done();
        }, 1000);
    });
});

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