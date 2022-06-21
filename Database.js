
  // COPY reviews FROM '/Users/jakereid/Desktop/reviews.csv' csv header;

  // COPY (product_id, rating, date, summary, body, recomended, reported, reviewer_name, reviewer_email, response, helpfulness) FROM 'Users/jakereid/Desktop/reviews.csv'
  // DELIMITER ‘,’
  // --command " "\\copy public.reviews (product_id, rating, date, summary, body, recomended, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/jakereid/Desktop/reviews.csv' CSV HEADER QUOTE '\"' ESCAPE '''';""

//COPY reviews (id, product_id, rating, date, summary, body, recomended, reported, reviewer_name, reviewer_email, response, helpfulness)
//FROM '/Users/jakereid/Desktop/reviews.csv'
//CSV HEADER;

// COPY characteristics (id, prodect_id, name)
// FROM '/Users/jakereid/Downloads/characteristics.csv'
// CSV HEADER;\

// ALTER SEQUENCE characteristic_reviews_id_seq RESTART WITH 19327690