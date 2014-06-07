// Home Buyer - Chrome Extension
// Copyright (C) 2014  Markis Taylor

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// See http://www.gnu.org/licenses/

define(['jquery', 'settings'], function($, globalSettings) {
	"use strict";

	var VALID_TAGS = [
		'section', 'nav', 'article', 'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'address', 'main', 'p', 'hr', 'pre', 'blockquote',
		'ol', 'ul', 'li', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'div', 'a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time',
		'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'table', 'caption', 'colgroup',
		'col', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th'
	];  //valid tags should be all tags that could contain readable content.  It should not be form fields or any type of input field.

	function Parser(jQuery, settings, container) {
		this.container = container || window.document;
		this.$ = jQuery || $;
		this.settings = settings || globalSettings.parser;
		this.internals = new Internals(this.$, this.settings, this.container);
	}
	Parser.prototype.getProperty = function getProperty() {
		var self = this.internals;
		var address = self.getAddress();
		var property = null;
		if (address.value)
		{
			property = {};
			if (this.container && this.container.location) {
				property.url = {value: this.container.location.href, element: this.container.location};
			}
			property.address = address;
			if (self.settings) {			
				for (var i = 0; i < self.settings.properties.length; i++) {
					var setting = self.settings.properties[i];
					if (setting.type === 'number') {
						property[setting.name] = self.getNumberValueFromDocument(setting);
					}
				}
			}
		}
		return property;
	};

	function Internals(jQuery, settings, container) {
		this.$ = jQuery;
		this.settings = settings;
		this.container = container;
		this.functions = settings.functions || {};
	}

	Internals.prototype.getAddress = function getAddress() {
		var value, element;
		var propertyValue = this.getPostalAddress();
		if (!propertyValue || !propertyValue.value) {
			propertyValue = this.getPlace();
		}
		if (!propertyValue || !propertyValue.value) {
			propertyValue = this.getValueFromRegex(/(\d+\s+['|:.,\s\w]*,\s*[A-Za-z]+[,\s]*\d{5}(-\d{4})?)/m);
		}
		return propertyValue;
	};

	Internals.prototype.getPostalAddress = function getPostalAddress() {
		var self = this;
		var value, element;
		var elements = self.$('[itemtype="http://schema.org/PostalAddress"]', this.container);

		for (var i = 0; i < elements.length; i++) {
			var addresses = self.$(elements[i]).parent().items('http://schema.org/PostalAddress').values();
			for (var j = 0; j < addresses.length; j++) {
				var address = addresses[j];
				if (address.streetAddress && address.addressLocality && address.addressRegion && address.postalCode) {
					element = elements[i];
					value = address.streetAddress + ', ' + address.addressLocality + ', ' + address.addressRegion + ' ' + address.postalCode;
					break;
				}
			}
		}
		return {value:value, element:element};
	};

	Internals.prototype.getPlace = function getPlace() {
		var self = this;
		var value, element;
		var addresses = [];
		var elements = self.$('[itemtype="http://schema.org/Place"]', this.container);
		for (var i = 0; i < elements.length; i++) {
			var places = self.$(elements[i]).parent().items('http://schema.org/Place').values();
			for (var j = 0; j < places.length; j++) {
				var place = places[j];
				if (place && place.address) {
					var address = place.address;
					if (!address.streetAddress) {
						address.streetAddress = place.name;
					}
					if (address && address.streetAddress && address.addressLocality && address.addressRegion && address.postalCode) {
						element = elements[i];
						value = address.streetAddress + ', ' + address.addressLocality + ', ' + address.addressRegion + ' ' + address.postalCode;
						break;
					}
				}
			}
		}
		
		return {value:value, element:element};
	};

	Internals.prototype.getNumberValueFromDocument = function getNumberValueFromDocument(setting) {
		if (!setting) return;

		var propertyValue;
		propertyValue = this.processMetaLocations(setting.metaLocations);
		if (!propertyValue || !propertyValue.value) {
			propertyValue = this.processFunctions(setting.functions);
		}
		if (!propertyValue || !propertyValue.value) {
			propertyValue = this.processRegexes(setting.regexes);
		}
		if (propertyValue && 'string' === typeof(propertyValue.value)) {
			propertyValue.value = propertyValue.value.replace(/\s{2,}/g, ' ').trim();
		}
		return propertyValue;
	};

	Internals.prototype.processMetaLocations = function processMetaLocations(metaLocations) {
		var self = this;
		var value, element;
		if (metaLocations && metaLocations.length > 0) {
			for (var i = 0; i < metaLocations.length; i++) {
				var metaLocation = metaLocations[i];
				var metaTag = self.$(metaLocation, this.container);
				if (metaTag && metaTag.length > 0) {
					element = metaTag[0];
					value = metaTag.attr('content');
					if (!value) {
						value = metaTag.text();
					}
					if (value) {
						return { value: value, element: element };
					}
				}
			}
		}
		return null;
	};

	Internals.prototype.processFunctions = function processFunctions(functions) {
		var self = this;
		var value, element, propertyValue;
		if (functions && functions.length > 0) {
			for (var i = 0; i < functions.length; i++) {
				var funcName = functions[i];
				var func = this.functions[funcName];
				if (func) {
					propertyValue = func(self.$, this.container);
					if (propertyValue && propertyValue.value) {
						return propertyValue;
					}
				}
			}
		}
		return null;
	};

	Internals.prototype.processRegexes = function processRegexes(regexes) {
		var value, element, propertyValue;
		if (regexes && regexes.length > 0) {
			for (var i = 0; i < regexes.length; i++) {
				var regex = regexes[i];
				var elements = this.getElementsByRegex(regex);
				propertyValue = this.getNumberFromSurroundingElements(elements);

				if (propertyValue) {
					if ('string' === typeof(propertyValue.value)) {
						propertyValue.value = propertyValue.value.replace(regex, '');
					}
					return propertyValue;
				}
			}
		}
		return null;
	};

	Internals.prototype.getValueFromRegex = function getValueFromRegex(regex) {
		var elems = this.getElementsByRegex(regex);
		return this.getValueFromElement(regex, elems);
	};

	Internals.prototype.getValueFromElement = function getValueFromElement(regex, $elems) {
		var self = this;
		var value, element;
		if ($elems && $elems.length > 0) {
			var text = self.$($elems[0]).text();
			var matches = regex.exec(text);
			text = matches[0];
			var trim = /\s{2,}/g;
			value = text.replace(trim, ' ');
			element = $elems[0];
		}
		return { value: value, element: element };
	};

	Internals.prototype.getElementsByRegex = function getElementsByRegex(regex) {
		var self = this;
		var elements = self.$(VALID_TAGS.join(', '), this.container);

		elements = elements.filter(function(idx, elem) { 
			var $elem = self.$(elem);
			return $elem.text().length < 1000 && self.isElementVisible($elem, false) && regex.test($elem.text()) ; 
		});

		elements = elements.filter(function(idx, elem) {
			return !self.isElementParentToAnotherElementInList(elem, elements);
		});

		elements = elements.filter(function(idx, elem) {
			var $elem = self.$(elem);
			return self.isElementVisible($elem, true);
		});

		elements.sort(function(elem, elem2) { 
			return self.$(elem).offset().top > self.$(elem2).offset().top ? 1 : -1;
		});

		return elements;
	};

	Internals.prototype.isElementVisible = function isElementVisible($elem, checkParents) {
		var self = this;
		var offset = $elem.offset();
		if (!offset || offset.top < 0 || offset.left < 0) {
			return false;
		}
		if ($elem.css('display') === 'none' || $elem.css('visibility') === 'hidden' || $elem.css('opacity') === '0') {
			return false;
		}
		if (checkParents) {
			var parents = $elem.parents();
			for (var i = 0; i < parents.length; i++) {
				$elem = self.$(parents[i]);
				if (!isElementVisible($elem)) {
					return false;
				}
			}
		}
		return true;
	};

	Internals.prototype.isElementParentToAnotherElementInList = function isElementParentToAnotherElementInList(element, elements) {
		var self = this;
		for (var i = elements.length - 1; i >= 0; i--) {
			var parents = self.$(elements[i]).parents();
			for (var j = parents.length - 1; j >= 0; j--) {
				if (element === parents[j])
					return true;
			}
		}
		return false;
	};

	Internals.prototype.getNumberFromSurroundingElements = function getNumberFromSurroundingElements(elements) {
		var self = this;
		var num, element;
		for (var j = 0; j < elements.length; j++) {
			element = elements[j];
			num = self.getNumberFromElement(element);
			if(!num) {
				var $elem = self.$(element);

				//first check all surounding content for numbers
				var elemOffset = $elem.offset();
				var contentsOfParents = $elem.parent().contents();
				for (var i = 0; i < contentsOfParents.length; i++) {
					var contentElem = contentsOfParents[i];
					var contentElemOffset = self.$(contentElem).offset();
					if (contentElemOffset.left === elemOffset.left || contentElemOffset.top === elemOffset.top) {
						element = contentElem;
						num = self.getNumberFromElement(contentElem);
						if (num) {
							break;
						}
					}
				}

				// second check the direct parent
				if(!num) {
					element = $elem.parent()[0];
					num = self.getNumberFromElement(element);
				}

				// sometimes it's better to get all the text from the contents instead of just the number
				//  ex: "1 and half baths" vs 1
				if (num) {
					num = self.$(element).text();
				}
			}
			if (num) {
				break; //break out of each loop
			}
		}
		return { value: num, element: element };
	};

	Internals.prototype.getNumberFromElement = function getNumberFromElement(element) {
		var self = this;
		var value = null;
		if (element) {
			var text = self.$(element).text();
			var regex = /[\d\.,]+/m;
			var match = regex.exec(text);
			if (match && match.length) {
				text = match[0];
				value = text.replace(/,/g, '');
			}
		}
		return value;
	};

	return Parser;
});
