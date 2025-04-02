// controllers/articleController.js
const Article = require("../models/articleModel");
const Log = require("../models/logModel");

/**
 * Create draft article (Author only)
 */
exports.createArticle = async (req, res) => {
  try {
    // Assume `req.user` is attached by auth middleware with userId, role
    const { title, content, category, keywords } = req.body;
    const authorId = req.user.userId;

    // Create draft
    const article = new Article({
      title,
      content,
      category,
      keywords,
      author: authorId,
      status: "draft",
    });
    await article.save();

    res.status(201).json({ msg: "Draft article created", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Editor publishes or updates article
 */
exports.publishArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const editorId = req.user.userId;
    // Editor finds the draft
    let article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    // Mark as published
    article.status = "published";
    article.editor = editorId;
    article.publishDate = new Date();

    await article.save();

    // Log action
    const log = new Log({
      article: article._id,
      action: "publish",
      changedBy: editorId,
    });
    await log.save();

    res.json({ msg: "Article published", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Only Admin can update an article once published
 */
exports.updatePublishedArticle = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { articleId } = req.params;
    let article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    if (article.status !== "published") {
      return res
        .status(400)
        .json({ msg: "Article is not published yet, no need for admin override" });
    }

    const { title, content, category, keywords } = req.body;

    // Keep track of old data for logs
    const oldData = {
      title: article.title,
      content: article.content,
      category: article.category,
      keywords: article.keywords,
    };

    // Update
    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;
    if (keywords !== undefined) article.keywords = keywords;

    await article.save();

    // Log changes
    const changes = {};
    if (title && title !== oldData.title) changes.title = title;
    if (content && content !== oldData.content) changes.content = content;
    if (category && category !== oldData.category) changes.category = category;
    if (keywords && keywords !== oldData.keywords) changes.keywords = keywords;

    const log = new Log({
      article: article._id,
      action: "updateAfterPublish",
      changedBy: req.user.userId,
      changes,
    });
    await log.save();

    res.json({ msg: "Article updated by admin", article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Public: get all published articles with filters (keyword, category, date)
 * No auth required
 */
exports.getArticles = async (req, res) => {
  try {
    const { keyword, category, date } = req.query;
    let query = { status: "published" }; // only published are publicly visible

    if (keyword) {
      // searching in title or content or keywords
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
        { keywords: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (date) {
      // Assuming date is in YYYY-MM-DD format
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.publishDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const articles = await Article.find(query)
      .populate("author", "name")
      .populate("editor", "name")
      .sort({ publishDate: -1 });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
