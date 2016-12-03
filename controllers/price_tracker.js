var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var sendgrid = require("sendgrid")("SENDGRID_APIKEY");
var email = new sendgrid.Email();

email.addTo("test@sendgrid.com");
email.setFrom("victoria.fajardo@gmail.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("and easy to do anywhere, even with Node.js");

sendgrid.send(email);

// var asin = 'B01E6AO69U';
var asin = 'B008BEYEL8'
var amzn_url = 'http://www.amazon.com/dp/' + asin;

console.log('requesting', amzn_url)
request(amzn_url, function (error, response, body) {
  fs.writeFile('product.html', body, function(error) {
    console.log('Page has been saved!');
  });

});

checkPrice();


var prev_price;

function checkPrice() {
  request (amzn_url, function (error, response, body) {
    var $ = cheerio.load(body);
    var list_price = $('#priceblock_ourprice').text();
    var stripped_price = +list_price.replace('$', '').replace(',', '');
    console.log('PRICE:', stripped_price);

    if(stripped_price <= prev_price){
      notify();
    }

    else(stripped_price >= prev_price)

    prev_price = stripped_price;

  });

  setTimeout(checkPrice, 60000)
}

function notify(){
  console.log('PUSH! ALERT! The  item price  is now lower!')
  var pushBullet = new pb("xxxxx");

  pushBullet.alert(null, "Amazon Price Watch",
  "Price dropped for: " amzn_url, function (error, response) {
    process.exit()
  });
}
