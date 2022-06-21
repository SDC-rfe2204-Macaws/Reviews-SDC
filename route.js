const {Client} = require('pg');


function reviews(req, res) {
  var client = new Client({
    user: 'jakereid',
    host: 'localhost',
    database: 'sdc',
    port: 5432
  });
  client.connect();
  var result = {
    product: req.body.product_id,
    page: req.body.page || 1,
    count: req.body.count || 5,
    results: []
  }
  client.query(`
    SELECT r.id, rating, summary, recomended, response, body, date, reviewer_name, helpfulness, reported, p.url
    FROM (
      SELECT id, rating, summary, recomended, response, body, date, reviewer_name, helpfulness, reported
      FROM reviews
      WHERE product_id = ${result.product}
      LIMIT ${result.count}
    ) AS r
    LEFT JOIN photos AS p
    ON r.id = p.review_id

  `)
  .then((ret) => {
    var cItem = null;
    var obj = {}
    ret.rows.forEach(item => {
      if (item.reported === 'true') {
        return
      }
    if (cItem === item.id) {
      if (!!item.url) {
        obj.photos.push(item.url)
      }
    } else {
      if (!!cItem) {
        result.results.push(obj);
      }
      cItem = item.id;
        obj = {
          review_id: item.id,
          rating: item.rating,
          summary: item.summary,
          recomended: item.recomended,
          response: item.response,
          body: item.body,
          date: item.data,
          reviewer_name: item.reviewer_name,
          helpfulness: item.helpfulness,
          photos: []
        }
        if (!!item.url) {
          obj.photos.push(item.url)
        }
    }
    });
  res.status(200).send(result);
  client.end();
  });
}

function helpful(req, res) {
  var client = new Client({
    user: 'jakereid',
    host: 'localhost',
    database: 'sdc',
    port: 5432
  });
  console.log(req.params['0']);
  client.connect
  client.query(`
    UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id = ${req.params['0']}
  `)
  .then(() => { res.status(204).send(); client.end()})
  .catch(err => { res.send(err); })
}

function report(req, res) {
  var client = new Client({
    user: 'jakereid',
    host: 'localhost',
    database: 'sdc',
    port: 5432
  });
  client.connect();
  client.query(`
    UPDATE reviews
    SET reported = true
    WHERE id = ${req.params['0']}
  `)
  .then(() => { res.status(204).send(); client.end(); })
  .catch(err => { res.send(err); });
}

function insert(req, res) {
  var rec = req.body.recomended ? 'true' : 'false';
  var text = 'INSERT INTO reviews (product_id, rating, date, summary, body, recomended, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id'
  var values = [req.body.product_id, req.body.rating, new Date().getTime(), req.body.summary, req.body.body, rec, 'false', req.body.name, req.body.email, null, 0]
  var client = new Client({
    user: 'jakereid',
    host: 'localhost',
    database: 'sdc',
    port: 5432
  });
  client.connect();
  client.query(text, values)
  .then(resu => {
    req.body.photos.forEach(photo => {
      client.query('INSERT INTO photos (review_id, url) VALUES ($1, $2)', [resu.rows[0].id, photo])
    });
    res.status(201).send();

  })
  .catch(err => {
    console.log(err);
  });

}

module.exports = {
  reviews: reviews,
  helpful: helpful,
  report: report,
  insert: insert
}
