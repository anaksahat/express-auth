const express = require('express');
const router = express.Router();
const { createArticle, getAllArticles, getArticleDetails, updateArticle, deleteArticle } = require('../controllers/articleController');

router.post('/create', createArticle);

router.get('/article', getAllArticles);

router.get('/articles/:id', getArticleDetails);

router.put('/articles/:id', updateArticle);

router.delete('/articles/:id', deleteArticle);

module.exports = router;
