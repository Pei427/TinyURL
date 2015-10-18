URLs = new Mongo.Collection("urls",{});

URLs.attachSchema(new SimpleSchema({
	originUrl:{
		type: String,
		label: "Original URL",
		max: 200
	},
	shortUrl:{
		type: String,
		label: "Short URL",
		max: 50
	}
}));