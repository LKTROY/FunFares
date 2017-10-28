/**
 * FareController
 *
 * @description :: Server-side logic for managing Fares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
			if (req.method == "POST") {
	        Fare.create(req.body.Fare).exec( function(err, fare) {
	            Fare.find().exec( function(err, allFares){
									return res.view('funfares/index', {'allFares': allFares});
								});
	        });
	    } else {
	        return res.view("funfares/create");
	    }
	},

	index: function(req, res) {
    Fare.find().exec( function(err, allFares) {
        return res.view('funfares/index', {'allFares': allFares});
    });
},

json: function(req, res) {
    Fare.find().exec( function(err, allFares) {
        return res.json(allFares);
    });
},

admin: function(req, res) {
	Fare.find().exec( function(err, allFares) {
			return res.view('funfares/admin', {'allFares': allFares});
	});
},

view: function (req, res) {
    Fare.findOne(req.params.id).exec( function(err, fare) {
        if (fare != null)
            return res.view('funfares/single', {'fare': fare});
        else
            return res.send("No such fare");
    });
},

delete: function(req, res) {
   Fare.findOne(req.params.id).exec( function(err, fare) {
        if (fare != null) {
            fare.destroy();
						Fare.find().exec( function(err, allFares) {
        return res.view('funfares/admin', {'allFares': allFares});
    });
        } else {
            return res.send("Fare not found");
        }
    });
},

update: function(req, res) {
    if (req.method == "GET") {
        Fare.findOne(req.params.id).exec( function(err, fare) {
            if (fare == null)
                return res.send("No such person!");
            else
                return res.view('funfares/update', {'fare': fare});
        });
    } else {
        Fare.findOne(req.params.id).exec( function(err, fare) {
            fare.region = req.body.Fare.region;
            fare.city = req.body.Fare.city;
						fare.class = req.body.Fare.class;
						fare.price = req.body.Fare.price;
						fare.file = req.body.Fare.file;
						fare.quota = req.body.Fare.quota;
            fare.save();
						Fare.find().exec( function(err, allFares){
								return res.view('funfares/index', {'allFares': allFares});
							});
        });
    }
},

search: function (req, res) {
	if (req.query.searchresult == 1){
		var dateString = req.query.date.split("-");
		var startDate = dateString[0];
		var endDate = dateString[1];
		var priceString = req.query.price.split(";");
		var startPrice = priceString[0];
		var endPrice = priceString[1];
		Fare.find()
        .where({region: {contains: req.query.region}})
				.where({"createdAt": {'>': new Date(startDate), '<': new Date(endDate)}})
				.where({price: {'>': startPrice, '<': endPrice}})
        .sort('region')
				.paginate({page: req.query.page, limit: 2})
        .exec( function (err, fares) {
					Fare.count().exec( function(err, value) {
							var pages = Math.ceil(value / 2 );
							return res.view( 'funfares/search', {'fares': fares, 'pages':pages, 'currentpage':req.query.page, 'region': req.query.region});
					});
        })
	} else {
		return res.view('funfares/search', {'fares': null});
	}
},

};
