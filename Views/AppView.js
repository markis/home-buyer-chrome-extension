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
define(['backbone', 'Models/Property', 'Views/SlideOutButtonView', 'Views/SaveButtonView', 'Views/DetailsView'], function(Backbone, Property, SlideOutButtonView, SaveButtonView, DetailsView) {
	var AppView = Backbone.View.extend({
		id: 'home-buyer-extension',
		initialize: function() {
			this.model = new Property();
			this.saveButton = new SaveButtonView({model: this.model});
			this.detailsPane = new DetailsView({model: this.model});
			this.slideOutButton = new SlideOutButtonView();
		},
		render: function() {
	        this.$el.empty();
	        this.model.fetch();
    		if (this.model.isValid()){
    	        this.$el.append(this.slideOutButton.$el);
    	        this.$el.append(this.saveButton.$el);
    	        this.slideOutButton.render();
    	        this.saveButton.render();
    	    } else {
    	    	this.$el.hide();
    	    }
	        return this;
	    }
	});
	return AppView;
});