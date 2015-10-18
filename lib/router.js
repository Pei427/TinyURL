
Router.configure({
	layoutTemplate:'layout'
});

Router.map(function(){
	//Route
	this.route('/',{path:'/',template:'shortener'});
	this.route('/:surl',function(){
		var target = URLs.findOne({shortUrl:this.params.surl});
		console.log(target);
		this.response.writeHead(302,{'Location': target.originUrl
		});
		this.response.end();
	},{where:'server'});
});