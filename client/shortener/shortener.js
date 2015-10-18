// add your events or helpers here
Base_URL = "http://localhost:3000/";
Template.shortener.helpers({
	urls:function(){
		return URLs.find();
	}
});

Template.shortener.events({
	'submit form':function(event,template){
		event.preventDefault();
		// Get value from form element
        var longurl = event.target.text.value;
		
		if(validateURL(longurl) ){
			if(!isExistURL(longurl)){

				// get short url
			var longToShortSize = getURLsTableSize();
			var shorturl = getSURL();

			// save in db
			URLs.insert({
				originUrl: longurl,
				shortUrl: shorturl
			});
			}

		}else{
			alert("This is not a valid URL.");
		}
	}
});

function getURLsTableSize(){
	return URLs.find().count();
};

function validateURL(textval) {
	var urlregex = new RegExp(
	"^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
	return urlregex.test(textval);
}

function isExistURL(longurl){
	return  URLs.findOne({originUrl:longurl}) === undefined ? false : true;
}


function generateShortURL(longToShortSize){
	return convertTo62(longToShortSize);
}

function convertTo62(num){
	var rawStr = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var encode = rawStr.split('');
	var ret = '';
	while(num !== 0){
		ret = encode[num % 62] + ret;
		num = parseInt(num / 62) + 1;
	}
	return ret;
}


// Borrowed from @buggie


// return a random interger number that is not in the database
var getSURL = function(){
  var rNum = 0;
  var str = '';
  do {
    rNum = getRandomIntInclusive(0, Math.pow(51, 6) - 1);
    // console.log(rNum);
    str = ShortURL.encode(rNum);
    // console.log(str);
  } while (URLs.find({shortUrl: str}).count() > 0);
  return str;
};

var getRandomIntInclusive = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
* ShortURL: Bijective conversion between natural numbers (IDs) and short strings
*
* ShortURL.encode() takes an ID and turns it into a short string
* ShortURL.decode() takes a short string and turns it into an ID
*
* Features:
* + large alphabet (51 chars) and thus very short resulting strings
* + proof against offensive words (removed 'a', 'e', 'i', 'o' and 'u')
* + unambiguous (removed 'I', 'l', '1', 'O' and '0')
*
* Example output:
* 123456789 <=> pgK8p
*
* Source: https://github.com/delight-im/ShortURL (Apache License 2.0)
*/
var ShortURL = new function() {
  var _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
      _base = _alphabet.length;
  this.encode = function(num) {
    var str = '';
    while (num > 0) {
      str = _alphabet.charAt(num % _base) + str;
      num = Math.floor(num / _base);
    }
    while (str.length < 6) str = _alphabet.charAt(0) + str;
    return str;
  };
  this.decode = function(str) {
    var num = 0;
    for (var i = 0; i < str.length; i++) {
      num = num * _base + _alphabet.indexOf(str.charAt(i));
    }
    return num;
  };
};
