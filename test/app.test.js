const app = require('../src/app.js');

describe('App', () => {
  it('GET /articles responds with list of articles from blogful_articles table', () => {
    return supertest(app)
      .get('/articles')
      .expect(200, "Hello World!")
  });
});
