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

require.config({
  baseUrl: '/',
  paths: {
    'backbone': '/lib/backbone.min',
    'jquery': '/lib/jquery.min',
    'underscore': '/lib/underscore.min'
  }
});
require(['jquery', 'underscore'], function($, _) {
	var background = chrome.extension.getBackgroundPage();
	if (background) {
		background.getSelectedProperty(function(data) {
			if (data) {

				$('#export-image').css('background-image', 'url(' + chrome.extension.getURL('/images/arrow.svg') + ')');
				$('#button-container').click(function() {
					$('#save-button').text('Saving');
					var msg = {
			  			action: 'saveProperty', 
			  			spreadSheetName: 'Home Buyer',
			  			property: data
			  		};
			  		chrome.extension.sendMessage(null, msg, function(response) { 
				        $('#save-button').text('Saved!'); 
				    });
				});

				var html = _.template($('#property-template').html(), data);
				$('body').prepend(html);
			}
		});
	}
});