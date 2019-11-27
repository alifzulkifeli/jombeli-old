
const cheerio = require('cheerio');
const fetch = require('node-fetch');


exports.listSearch = (req, res) => {

  const item = []
    fetch(`https://www.mercari.com/jp/search/?page=${req.query.page||1}&sort_order=price_asc&keyword=${req.query.search}&price_min=${req.query.min_price}&price_max=${req.query.max_price}`)

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
            price : $(el).find('.items-box-price').text(),
            link : $(el).attr('href'),
            status : $(el).find('.item-sold-out-badge').text(),
            image : $(el).children().children().attr('data-src'),
            description : ''
          }
          item.push(mercari_item);
        });
        res.json(item);
      });
};

