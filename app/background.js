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
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == 'install') {
      chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
        if ('undefined' === typeof token) {
          chrome.tabs.create({url:'html/setup.html'});
        }
      });
  }
});
require( ['modules/SpreadsheetProvider'], function(SpreadsheetProvider){
  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action == 'saveProperty') {
      var spreadsheetProvider = new SpreadsheetProvider();
      spreadsheetProvider.save(msg.spreadSheetName, msg.property, function(data) {
        sendResponse();
      }, function(e) {
        sendResponse(e);
      });
      return true;
    }
  });
});