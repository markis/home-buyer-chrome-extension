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
define(['backbone', 'models/Property'], function(Backbone, Property) {
	var spreadSheetName = 'Home Buyer';
	var SaveButtonView = Backbone.View.extend({
		tagName: 'button',
		id: 'home-buyer-extension-save-button',
		events: {
			'click' : 'saveProperty'
		},
		render: function() {
			this.$el.text('Save to Trulia');
			return this;
		},
		saveProperty:  function() {
			var self = this;
			var property = this.model.toJSON();
      		var data = {
      			action: 'saveProperty', 
      			spreadSheetName: spreadSheetName, 
      			property: property
      		};

			self.$el.text('Saving');
      		self.$el.attr('disabled', true);
      		chrome.extension.sendMessage(null, data, function(response) { 
		        self.$el.text('Saved!'); 
		    });
		}
	});
	return SaveButtonView;
});