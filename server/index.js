// ====== デバッグ出力 ======
console.log("✅ mongoose require path:", (() => {
  try { return require.resolve("mongoose"); }
  catch (e) { return e.message; }
})());

console.log("✅ Running in folder:", __dirname);
console.log("✅ Current working directory:", process.cwd());

// ====== モジュール読み込み ======
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// ====== Mongooseモデル読み込み ======
const FearReport = require("./models/FearReport"); // ← 相対パスOK

// ====== Express設定 ======
const app = express();
const PORT = process.env.PORT || 3001;

// ====== MongoDB接続 ======
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ====== ミドルウェア設定 ======
app.use(cors());
app.use(express.json());

// JSONパースエラー対応
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "不正なJSON形式です" });
  }
  next();
});

// ====== 動作確認ルート ======
app.get("/", (req, res) => {
  res.send("Phobiaサーバーは正常に稼働中です！");
});

// ====== 重複チェック関数 ======
const isDuplicateReport = (existingReport, newReport) => {
  if (existingReport.types.length !== newReport.types.length) return false;

  const set1 = new Set(existingReport.types);
  const set2 = new Set(newReport.types);
  for (const type of set1) {
    if (!set2.has(type)) return false;
  }

  const trim = str => (str || "").trim();

  if (trim(existingReport.detail) !== trim(newReport.detail)) return false;
  if (trim(existingReport.time) !== trim(newReport.time)) return false;
  if ((existingReport.movieId || "") !== (newReport.movieId || "")) return false;

  return true;
};

// ====== APIルート ======

// GET: 恐怖要素の一覧取得
app.get("/fear_reports", async (req, res) => {
  try {
    const reports = await FearReport.find().sort({ createdAt: -1 }).exec();
    res.json(reports);
  } catch (err) {
    console.error("❌ MongoDB取得エラー:", err);
    res.status(500).json({ error: "恐怖要素の読み込みに失敗しました" });
  }
});

// POST: 恐怖要素の追加（重複チェックつき）
app.post("/fear_reports", async (req, res) => {
  const newReport = req.body;

  if (!newReport.detail || typeof newReport.detail !== "string" || !newReport.detail.trim()) {
    return res.status(400).json({ error: "詳細（detail）は必須です" });
  }

  if (!Array.isArray(newReport.types) || newReport.types.length === 0) {
    return res.status(400).json({ error: "恐怖要素タイプ（types）は必須です" });
  }

  try {
    const existingReports = await FearReport.find().exec();
    const duplicate = existingReports.some(report => isDuplicateReport(report, newReport));

    if (duplicate) {
      return res.status(409).json({ error: "重複した恐怖要素の登録はできません。" });
    }

    const fearReport = new FearReport(newReport);
    await fearReport.save();

    console.log("✅ 新しい恐怖要素を追加:", newReport);
    res.status(201).json({ message: "送信に成功しました！" });
  } catch (err) {
    console.error("❌ MongoDB保存エラー:", err);
    res.status(500).json({ error: "恐怖要素の保存に失敗しました" });
  }
});

// ====== Reactアプリ配信（build） ======
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ====== サーバー起動 ======
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
