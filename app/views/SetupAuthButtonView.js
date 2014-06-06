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
define(['backbone', 'modules/SpreadsheetProvider'], function(Backbone, SpreadsheetProvider) {
	var SetupAuthButtonView = Backbone.View.extend({
		tagName: 'button',
		id: 'home-buyer-extension-save-button',
		events: {
			'click' : 'setupAuth'
		},
		render: function() {
			this.$el.text('Give Home Buyer Authorization');
			return this;
		},
		setupAuth:  function() {
			var self = this;
			self.$el.attr('diabled', true);
		    self.$el.text('Setting up authorization...');
		    var spreadsheetProvider = new SpreadsheetProvider();
		    spreadsheetProvider.setupAccount(function() {
		    	self.$el.text('Success!');
		    }, function() {
		    	self.$el.attr('diabled', false);
		        self.$el.text('Failed, retry!');
		    });
		}
	});
	return SetupAuthButtonView;
});