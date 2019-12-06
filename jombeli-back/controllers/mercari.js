
const cheerio = require('cheerio');
const fetch = require('node-fetch');
var request = require("request");

exports.listSearch = (req, res) => {

  const item = [];
  const options = {
    method: 'GET',
    url: 'https://currency-exchange.p.rapidapi.com/exchange',
    qs: {q: '1.0', from: 'jpy', to: 'MYR'},
    headers: {
      'x-rapidapi-host': 'currency-exchange.p.rapidapi.com',
      'x-rapidapi-key': '43054b433amsh968b5b7eefe8149p160699jsn0e21e14e7ec2'
    }
  };
  
  request(options, function (error, response, prices) {
    if (error) throw new Error(error);
  
    fetch(`https://www.mercari.com/jp/search/?page=${req.query.page||1}&keyword=${req.query.search}&price_min=${req.query.min_price || ""}&price_max=${req.query.max_price || ""}&status_on_sale=1`)

      .then(res => res.text())
      .then(body => {
        
        const $ = cheerio.load(body,
          {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: true,
            decodeEntities: true
          }
        );
        $('.items-box a').each((i,el) => {

          const mercari_item = {
            name : $(el).find('.items-box-name').text(),
            // price : parseInt($(el).find('.items-box-price').text().substr(1)) ,
            price : parseFloat($(el).find('.items-box-price').text().substr(1).replace(/,/g, '')) * parseFloat(prices),
            link : $(el).attr('href'),
            image1 : $(el).children().children().attr('data-src'),
            description : ''
          }
        
          mercari_item.price = (Math.round(mercari_item.price * 100) / 100).toFixed(2);

          item.push(mercari_item);
  
        });
        res.json(item);
      });
  });

    
    
      
      
};


// const getCurrency = (req, res) => {
//   fetch(`https://api.exchangeratesapi.io/latest?base=JPY&symbols=MYR`)
//     .then(res => res.text())
//     .then(body => {
//       const data = JSON.parse(body);
//       let currencyValue = 0.03;
//       currencyValue = data.rates.MYR;
//       res.json(currencyValue);
//     });  
// };





