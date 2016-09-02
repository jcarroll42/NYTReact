// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');

// nyt API
var nytAPI = "cb9b6375ca7d4ed683e1c2d773c88813";

// Helper Functions (in this case the only one is runQuery)
var helpers = {

	// This function serves our purpose of running the query to geolocate. 
	runQuery: function(term, startDate, endDate){

		console.log(location);

		//Figure out the geolocation
		var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + nytAPI + "&q=" + term + "&begin_date=" + startDate + "&end_date=" + endDate + "&page=1";

		return axios.get(queryURL)
			.then(function(response){

				console.log(response);
				return response.docs;
		})

	},

	// This function hits our own server to retrieve the record of query results
	getHistory: function(){

		return axios.get('/api')
			.then(function(response){

				console.log(response);
				return response;
			});
	},

	// This function posts new searches to our database.
	postHistory: function(location){

		return axios.post('/api', {location: location})
			.then(function(results){

				console.log("Posted to MongoDB");
				return(results);
			})
	}

}


// We export the helpers function 
module.exports = helpers;