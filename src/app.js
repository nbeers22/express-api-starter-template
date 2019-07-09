require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const ArticlesService = require('./articles-service.js');

const app = express();

const morganSetting = 
  NODE_ENV === "production"
  ? "tiny"
  : "dev"

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/articles', (req,res,next) => {
  const knexInstance = req.app.get('db');

  ArticlesService.getAllArticles(knexInstance)
    .then(articles => {
      res.json(articles)
    })
    .catch(next)
});

app.get('/articles/:article_id', (req,res,next) => {
  const id = req.params.article_id;
  const knexInstance = req.app.get('db');

  ArticlesService.getById(knexInstance,id)
    .then(article => {
      if(!article){
        return res
          .json(404,
            {
              error: {
                message: "Article doesn't exist"
              }
            }
          )
      }
      res.json(article)
    })
    .catch(next)
});

const errorHandler = (error,req,res,next) => {
  let response;
  if (NODE_ENV === "production") {
    response = { error : { message: "server error" } }
  }else{
    console.error(error);
    response = { message: error.message, error }
  }
  res.status(500).json(response);
}

app.use(errorHandler);

module.exports = app;