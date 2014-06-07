var should = require('should');
var jsdom = require('jsdom');
var fs = require('fs');
var jqueryScript = fs.readFileSync(__dirname + '/../app/lib/jquery.min.js', 'utf-8');
var requirejs = require('requirejs');
requirejs.config({
	baseUrl: __dirname + '/../app/',
	nodeRequire: require,
});

var Parser = requirejs('modules/Parser');

describe("Parser", function() {
   describe(".getProperty()", function() {
       it("should get a property from the zillow sample dom", function(){
			jsdom.env({
				html: fs.readFileSync(__dirname + '/test-html/zillow.html', 'utf-8'),
				src: [jqueryScript],
				done: function (errors, window) {

					var parser = new Parser(window.$, null, window.document);
					var property = parser.getProperty();

					property.address.value.should.equal('2602 Pacific Ave, San Francisco, CA 94115');
					property.price.value.should.equal('8995000');
					property.bed.value.should.equal('6');
					property.bath.value.should.equal('6.5');
					property.sqft.value.should.equal('4900');

				}
			});
       });
       it("should get a property from the trulia sample dom", function(){
			jsdom.env({
				html: fs.readFileSync(__dirname + '/test-html/trulia.html', 'utf-8'),
				src: [jqueryScript],
				done: function (errors, window) {

					var parser = new Parser(window.$, null, window.document);
					var property = parser.getProperty();

					property.address.value.should.equal('2602 Pacific Ave, San Francisco, CA 94115');
					property.price.value.should.equal('$8,995,000');
					property.bed.value.should.equal('6');
					property.bath.value.should.equal('7');
					property.sqft.value.should.equal('4900');

				}
			});
       });
       it("should get a property from the redfin sample dom", function(){
			jsdom.env({
				html: fs.readFileSync(__dirname + '/test-html/redfin.html', 'utf-8'),
				src: [jqueryScript],
				done: function (errors, window) {

					var parser = new Parser(window.$, null, window.document);
					var property = parser.getProperty();

					// property.address.value.should.equal('2602 Pacific Ave, San Francisco, CA 94115');
					// property.price.value.should.equal('8995000');
					// property.bed.value.should.equal('6');
					// property.bath.value.should.equal('6');
					// property.sqft.value.should.equal('4,900');

				}
			});
       });
       it("should get a property from the realtor.com sample dom", function(){
			jsdom.env({
				html: fs.readFileSync(__dirname + '/test-html/realtor.html', 'utf-8'),
				src: [jqueryScript],
				done: function (errors, window) {

					var parser = new Parser(window.$, null, window.document);
					var property = parser.getProperty();

					property.address.value.should.equal('2602 Pacific Ave, San Francisco, CA 94115');
					property.price.value.should.equal('$8,995,000');
					property.bed.value.should.equal('6 Bed');
					property.bath.value.should.equal('7 Bath');
					property.sqft.value.should.equal('4900');

				}
			});
       });
       it("should get a property from the estately sample dom", function(){
			jsdom.env({
				html: fs.readFileSync(__dirname + '/test-html/estately.html', 'utf-8'),
				src: [jqueryScript],
				done: function (errors, window) {

					var parser = new Parser(window.$, null, window.document);
					var property = parser.getProperty();

					property.address.value.should.equal('2602 Pacific Ave, San Francisco, CA 94115');
					property.price.value.should.equal('$8,995,000');
					property.bed.value.should.equal('6');
					property.bath.value.should.equal('6.5');
					property.sqft.value.should.equal('-');

				}
			});
       });
       it("should get a property from the homes.com sample dom", function(){
			jsdom.env({
				html: fs.readFileSync(__dirname + '/test-html/homes.html', 'utf-8'),
				src: [jqueryScript],
				done: function (errors, window) {
					
					var parser = new Parser(window.$, null, window.document);
					var property = parser.getProperty();

					property.address.value.should.equal('2602 Pacific Ave, San Francisco, CA 94115');
					property.price.value.should.equal('8995000');
					property.bed.value.should.equal('6');
					property.bath.value.should.equal('6');
					//property.sqft.value.should.equal('4,900');

				}
			});
       });
   });
});