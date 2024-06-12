const { validationResult } = require("express-validator");
const database = require("../model/database");

// Get All Articles
async function getAllArticles(req, res) {
    try {
        const [articles] = await database.query("SELECT * FROM article");
        return res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Get Article Details
async function getArticleDetails(req, res) {
    const articleID = req.params.id;  // Extracting article ID from request parameters
    try {
        const [article] = await database.query("SELECT * FROM article WHERE article_id = ?", [articleID]);
        if (!article || article.length === 0) {
            return res.status(404).json({
                error: "Article not found"
            });
        }
        return res.status(200).json(article[0]);  // Return the first article in the result set
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Create Article
async function createArticle(req, res) {
    const { title, articlecontent_id, category } = req.body;  // Updated Content to articlecontent_id
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        const [newArticle] = await database.query(
            "INSERT INTO article (title, articlecontent_id, category, date_added) VALUES (?, ?, ?, NOW())",
            [title, articlecontent_id, category]
        );

        if (newArticle.affectedRows > 0) {
            return res.status(201).json({
                message: "Article created",
                article_id: newArticle.insertId
            });
        } else {
            throw new Error("Failed to create article");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Update Article
async function updateArticle(req, res) {
    const articleID = req.params.id;
    const { title, articlecontent_id, category } = req.body;  // Updated Content to articlecontent_id

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        const [updatedArticle] = await database.query(
            "UPDATE article SET title = ?, articlecontent_id = ?, category = ? WHERE article_id = ?",
            [title, articlecontent_id, category, articleID]
        );

        if (updatedArticle.affectedRows > 0) {
            return res.status(200).json({
                message: "Article updated"
            });
        } else {
            return res.status(404).json({
                error: "Article not found"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Delete Article
async function deleteArticle(req, res) {
    const articleID = req.params.id;

    try {
        const [deletedArticle] = await database.query("DELETE FROM article WHERE article_id = ?", [articleID]);

        if (deletedArticle.affectedRows > 0) {
            return res.status(200).json({
                message: "Article deleted"
            });
        } else {
            return res.status(404).json({
                error: "Article not found"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

module.exports = {
    getAllArticles,
    getArticleDetails,
    createArticle,
    updateArticle,
    deleteArticle
};
