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
		tagName: 'button',
		id: 'home-buyer-extension-slide-out-button',
		render: function() {
			this.$el.append('<svg xmlns="http://www.w3.org/2000/svg" style="height: 26px;position: absolute;left: 15px;top: 6px;" viewBox="0 0 39 74" version="1.1"><style>.style0{fill:none;fill-rule:evenodd;}.style1{fill:#FFFFFF;}</style><g class="style0"><path d="M19.9998338 31 C15.0294786 31 11 27 11 22 C11 17 15 13 20 13 C24.9705214 13 29 17 29 22 C29 27 25 31 20 31 L19.9998338 31 Z M19.5 0 C7.64941703 0.1 0 8 0 19.9 C0 29.7 6.5 38.2 10.2 51 C12.3138645 58.4 13.5 67.4 14.1 74 L24.9480061 74 C25.5460544 67.4 26.7 58.4 28.8 51 C32.5058212 38.2 39 29.7 39 19.9 C39 8 31.4 0.1 19.5 0 L19.5 0 Z" class="style1"/></g></svg>');
			this.$el.append('<svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;background: #3c3f55;bottom: -1px;padding: 1px 1px;right: 0px;width: 15px;height: 15px" viewBox="0 0 36 25" version="1.1"><style>.style0{fill: none;fill-rule: evenodd;}.style1{fill:  #FFFFFF;}</style><g class="style0"><path d="M20.0422888 15.6 C17.4147008 15.6 15.2 15.7 13.4 16 C11.5347048 16.2 9.9 16.7 8.5 17.5 C7.0966687 18.2 5.8 19.3 4.6 20.6 C3.34756884 22 2.1 23.8 0.7 26 C0.912262542 22.6 1.7 19.5 3.1 16.7 C3.70005738 15.5 4.5 14.4 5.4 13.2 C6.31161228 12.1 7.5 11.1 8.8 10.2 C10.2209333 9.4 11.8 8.7 13.6 8.1 C15.4760854 7.6 17.6 7.3 20 7.3 L20.0422888 0 L36 11.7 L20.0422888 23.9 L20.0422888 15.6 Z" class="style1"/></g></svg>');
			return this;
		}
	});
	return SlideOutButtonView;
});