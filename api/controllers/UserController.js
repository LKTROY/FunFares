/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function (req, res) {
    if (req.method == "GET")
        return res.view('funfares/login');
    else {
        User.findOne({username:req.body.username})
        .exec( function (err, user) {

					console.log("1");
			// Load the bcrypt module
			var bcrypt = require('bcrypt');
			// Generate a salt
			var salt = bcrypt.genSaltSync(10);
            if (user == null)
                return res.send("No such user");
            if (!bcrypt.compareSync(req.body.password, user.password))
                return res.send(user.password);
            console.log("The session id " + req.session.id + " is going to be destroyed.");
            req.session.regenerate(function(err) {
                console.log("The new session id is " + req.session.id + ".");
                req.session.username = req.body.username;
								req.session.userid = user.id;
								return res.send("login successfully.");
            });
        });
    }
},
logout: function(req, res) {

    console.log("The current session id " + req.session.id + " is going to be destroyed.");

    req.session.destroy(function(err) {
			return res.redirect("http://localhost:1337/fare/index");
    });
},
addPackage: function(req, res) {
	User.findOne(req.session.userid).exec( function (err, model) {

        if (model !== null) {
            model.purchase.add(req.query.pid);
            model.save();
						return res.redirect("http://localhost:1337/user/showPackage");
        }
        else {
            return res.send("User not found!");
        }
    })
},
showPackage: function(req, res) {
		User.findOne(req.session.userid).populateAll().exec( function (err, myPackage) {
			//return res.json(myPackage);
			return res.view('funfares/mypackage', {'myPackage':myPackage});
    });
},
showPurchase: function(req, res){

	Fare.findOne(req.params.id).populateAll().exec( function (err, purchase) {

	        //return res.json(purchase);

			return res.view('funfares/purchase', {'purchase':purchase});
		})
	},
removePackage: function(req, res) {
	if (req.method == "GET"){
		res.redirect("/");
	}else {
	User.findOne(req.session.userid).exec( function (err, model) {
        if (model !== null) {
					console.log(req.params.id);
            model.purchase.remove(req.params.id);
            model.save();
						return res.send("Removed!");
        }
        else {
            return res.send("User not found!");
        }
    })

	}
}
};
