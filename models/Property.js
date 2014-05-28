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
define(['backbone', 'Modules/Parser', 'Models/PropertyValue'], function(Backbone, Parser, PropertyValue) {

	var Property = Backbone.Collection.extend({

		fetch: function Property_fetch(options) {
			var parser = new Parser();
			var property = parser.getProperty();
			if (property) {
				var keys = Object.keys(property);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					var propertyValue = property[key];
					propertyValue.id = key;
					this.add(new PropertyValue(propertyValue));
				}
			}
			return property;
		},
		toJSON: function Property_toJSON() {
			var data =  {};
			var values = this.toArray();
			for (var i = 0; i < values.length; i++) {
				var propertyValue = values[i];
				data[propertyValue.id] = propertyValue.get('value');
			}
			return data;
		},
		isValid: function Property_isValid() {
			var values = this.toArray();
			for (var i = 0; i < values.length; i++) {
				var propertyValue = values[i];
				if (!propertyValue.get('value')) {
					return false;
				}
			}
			if (values && values.length > 0) {
				return true;
			} else {
				return false;
			}
		}
	});

	return Property;
});