const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { addFearReport, getFearReports } = require("./notionClient");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// JSONパースエラー対応
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "不正なJSON形式です" });
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Phobiaサーバーは正常に稼働中です！（MongoDBは使いません）");
});

// POST: 恐怖要素をNotionに追加
app.post("/fear_reports", async (req, res) => {
  const newReport = req.body;

  if (!newReport.detail || typeof newReport.detail !== "string" || !newReport.detail.trim()) {
    return res.status(400).json({ error: "詳細（detail）は必須です" });
  }

  if (!Array.isArray(newReport.types) || newReport.types.length === 0) {
    return res.status(400).json({ error: "恐怖要素タイプ（types）は必須です" });
  }

  try {
    const response = await addFearReport(newReport);
    console.log("💾 Notionに保存成功:", response.id);
    res.status(201).json({ message: "Notionに保存しました", id: response.id });
  } catch (error) {
    console.error("❌ Notion保存エラー:", error);
    res.status(500).json({ error: "Notionへの保存に失敗しました" });
  }
});

// GET: Notionから恐怖要素レポートを取得して返す
app.get("/fear_reports", async (req, res) => {
  try {
    const reports = await getFearReports();
    res.json(reports);
  } catch (error) {
    console.error("❌ Notion取得エラー:", error);
    res.status(500).json({ error: "Notionデータ取得に失敗しました" });
  }
});

// Reactアプリ配信
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
