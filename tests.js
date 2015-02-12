QUnit.test( "B1 search page is displayed", function( assert ) {
    openInitialPage(assert, function (done) {
        assert.ok( appFrame().hasSearchButton(), "Has search button" );
        assert.ok( appFrame().hasLocationInput(), "Has location field");
        done();
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
        hasSearchButton: function() {
            return this.elem.contents().find("#searchButton").length > 0;
        },
        hasLocationInput: function() {
            return this.elem.contents().find("#location").length > 0;
        }

    };
}