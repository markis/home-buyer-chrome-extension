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

require( ['jquery', 'Views/AppView'], function($, AppView) {
  'use strict';

  var appView = new AppView();
  $('body').prepend(appView.render().el);
});