define(function() {
	return {
		parser: {
			properties: [
				{
					name: 'price',
					type: 'number', 
					metaLocations: [ 'meta[name$="price"]', 'meta[property$="price"]' ], 
					functions: [ 'getPriceFromSchema' ], 
					regexes: [ /(\$[\s]*?[\d,]+)(.00)?/m ]
				}, 
				{
					name: 'bed',
					type: 'number', 
					metaLocations: [ 'meta[name$="beds"]', 'meta[property$="beds"]' ], 
					functions: null, 
					regexes: [ /\bbedroom|beds|bed|bd|br\b/i ]
				}, 
				{
					name: 'bath',
					type: 'number', 
					metaLocations: [ 'meta[name$="baths"]', 'meta[property$="baths"]' ], 
					functions: null, 
					regexes: [ /\bbathroom|baths|bath|ba\b/i ]
				}, 
				{
					name: 'sqft',
					type: 'number', 
					metaLocations: [ 'meta[name$="sqft"]', 'meta[property$="sqft"]', 'meta[property$="square_feet"]' ], 
					functions: null, 
					regexes: [ /\b(sq|square)[\s\.]*?(footage|ft|feet)\b/i ]
				}
			],
			functions: {
				getMainImage: function getMainImage($, container) {
					return {value: $('meta[property="og:image"]').attr('content'), element: element};
				},
				getPriceFromSchema: function getPriceFromSchema($, container) {
					var value, element;
					$('[itemtype="http://schema.org/Offer"]', container).each(function(idx, elem){
						var offers = $(elem).parent().items('http://schema.org/Offer').values().filter(function(offer) { return offer.price; });
						if (offers && offers.length > 0) {
							if (offers[0].price) {
								value = offers[0].price;
								element = elem;
								return false;
							}
						}
					});
					if (value) {
						return {value: value, element: element};
					} else {
						return null;
					}
				}
			}
		}
	};
});