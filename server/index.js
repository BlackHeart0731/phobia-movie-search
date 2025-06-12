const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// JSONパースエラーなどのハンドリング用ミドルウェア
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "不正なJSON形式です" });
  }
  next();
});

const DATA_FILE = path.join(__dirname, "fear_reports.json");

// ファイルが無ければ空配列で初期化
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// 重複チェック関数
const isDuplicateReport = (existingReports, newReport) => {
  return existingReports.some((report) => {
    // types配列の要素数と中身を比較（順序は無視）
    if (report.types.length !== newReport.types.length) return false;
    const set1 = new Set(report.types);
    const set2 = new Set(newReport.types);
    for (const t of set1) {
      if (!set2.has(t)) return false;
    }

    // detailとtimeをトリムして比較
    if ((report.detail || "").trim() !== (newReport.detail || "").trim()) return false;
    if ((report.time || "").trim() !== (newReport.time || "").trim()) return false;

    // movieIdはない場合もあるので空文字列で統一して比較
    const id1 = report.movieId || "";
    const id2 = newReport.movieId || "";
    if (id1 !== id2) return false;

    return true; // 全て一致すれば重複あり
  });
};

// GET: 恐怖要素一覧の取得
app.get("/fear_reports", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("ファイル読み込みエラー:", err);
      return res.status(500).json({ error: "恐怖要素の読み込みに失敗しました" });
    }
    try {
      const reports = JSON.parse(data || "[]");
      res.json(reports);
    } catch (parseErr) {
      console.error("JSONパースエラー:", parseErr);
      res.status(500).json({ error: "データの解析に失敗しました" });
    }
  });
});

// POST: 新しい恐怖要素の追加（重複チェックあり）
app.post("/fear_reports", (req, res) => {
  const newReport = req.body;

  // バリデーション（detail必須）
  if (!newReport.detail || typeof newReport.detail !== "string" || !newReport.detail.trim()) {
    return res.status(400).json({ error: "詳細（detail）は必須です" });
  }

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("ファイル読み込みエラー:", err);
      return res.status(500).json({ error: "恐怖要素の読み込みに失敗しました" });
    }

    let reports = [];
    try {
      reports = JSON.parse(data || "[]");
    } catch (parseErr) {
      console.error("JSONパースエラー:", parseErr);
      return res.status(500).json({ error: "データの解析に失敗しました" });
    }

    // 重複チェック
    if (isDuplicateReport(reports, newReport)) {
      return res.status(409).json({ error: "重複した恐怖要素の登録はできません。" });
    }

    reports.push(newReport);

    fs.writeFile(DATA_FILE, JSON.stringify(reports, null, 2), (err) => {
      if (err) {
        console.error("ファイル書き込みエラー:", err);
        return res.status(500).json({ error: "恐怖要素の保存に失敗しました" });
      }
      console.log("新しい恐怖要素を追加:", newReport);
      res.status(201).json({ message: "送信に成功しました！" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
