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


var getSelectedProperty = function(callback) { callback(null); };
(function() {
  var properties = {};
  var selectedId;
  var selectedProperty;

  getSelectedProperty = function(callback) {
    if (selectedProperty) {
      callback(selectedProperty);
    } else {
      chrome.tabs.getSelected(null, function(tab){
        updateProperty(tab.id, callback);
      });
    }
  };

  chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == 'install') {
        chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
          if ('undefined' === typeof token) {
            chrome.tabs.create({url:'html/setup.html'});
          }
        });
    }
  });
  chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    if (change.status == 'complete') {
      updateProperty(tabId);
    }
  });
  chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
    selectedId = tabId;
    updateSelected(tabId);
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    updateProperty(tabs[0].id);
  });

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    require( ['modules/SpreadsheetProvider'], function(SpreadsheetProvider){
      if (msg.action == 'saveProperty') {
        var spreadsheetProvider = new SpreadsheetProvider();
        if (!msg.property) {
          msg.property = selectedProperty;
        }
        spreadsheetProvider.save(msg.spreadSheetName, msg.property, function(data) {
          sendResponse();
        }, function(e) {
          sendResponse(e);
        });
        return true;
      }
    });
  });

  function updateSelected(tabId) {
    selectedProperty = properties[tabId];
    if (selectedProperty) {
      chrome.pageAction.setTitle({tabId:tabId, title:selectedProperty.address});
    }
  }

  function updateProperty(tabId, callback) {
    chrome.tabs.sendRequest(tabId, {}, function(property) {
      properties[tabId] = property;
      if (!property) {
        chrome.pageAction.hide(tabId);
      } else {
        chrome.pageAction.show(tabId);
        if (selectedId == tabId) {
          updateSelected(tabId);
        }
      }
      if (callback) {
        callback(property);
      }
    });
  }

})();