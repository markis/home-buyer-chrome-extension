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
define(['backbone'], function(Backbone) {
	var SlideOutButtonView = Backbone.View.extend({
		tagName: 'div',
		id: 'home-buyer-extension-slide-out-button',
		render: function() {
			this.$el.css('background-image', this.$el.css('background-image', 'url(' + chrome.extension.getURL('/images/arrow.svg') + ')'));

			return this;
		}
	});
	return SlideOutButtonView;
});