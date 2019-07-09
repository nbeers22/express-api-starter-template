// const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const testArticles = require('./articles.fixtures.js');

describe.only('Articles Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => (
    db.destroy()
  ));

  before('clean the table', () => (
    db('blogful_articles').truncate()
  ));

  afterEach('Remove test articles from  db', () => (
    db('blogful_articles').truncate()
  ));

  describe('GET /articles', () => {
    context('Given blogful_articles table has data', () => {
      
      beforeEach('Insert test articles into the db', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      });

      it('responds with 200 and list of articles from blogful_articles table', () => {
        return supertest(app)
          .get('/articles')
          .expect(200,testArticles)
      });
    });

    context('Given blogful_articles table has no data', () => {
      it('responds with 200 and empty array', () => {
        return supertest(app)
          .get('/articles')
          .expect(200,[])
      });
    });
  });

  describe('GET /articles/:article_id', () => {
    context('Given blogful_articles table has data', () => {
      
      beforeEach('Insert test articles into the db', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      });

      it('responds with 200 and the corresponding article', () => {
        const articleId = 1;
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(200,testArticles[articleId - 1])
      });
    });

    context('Given id is not found in blogful_articles table', () => {
      
      it('responds with 404 and empty array', () => {
        const articleId = 1;
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(404,{ error: { message: "Article doesn't exist" }})
      });
    });
  });
});