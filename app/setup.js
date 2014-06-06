require.config({
  baseUrl: '/',
  paths: {
    'backbone': '/lib/backbone.min',
    'jquery': '/lib/jquery.min',
    'underscore': '/lib/underscore.min'
  }
});

function gapiIsLoaded() {
	console.log(arguments);
}

require( ['jquery', 'views/SetupAuthButtonView', 'views/CreateSpreadsheetButtonView'], function($, SetupAuthButtonView, CreateSpreadsheetButtonView) {
  'use strict';

  var setupAuthButtonView = new SetupAuthButtonView();
  $('#buttonAuthLocation').append(setupAuthButtonView.render().el);

  var createSpreadsheetButtonView = new CreateSpreadsheetButtonView();
  $('#buttonCreateLocation').append(createSpreadsheetButtonView.render().el);
});