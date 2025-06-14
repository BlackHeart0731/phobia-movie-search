// models/FearReport.js
const mongoose = require("mongoose");

const FearReportSchema = new mongoose.Schema({
  movieId: { type: String, default: "" },
  types: { type: [String], required: true },  // 恐怖要素タイプの配列（必須）
  detail: { type: String, required: true },  // 詳細（必須）
  time: { type: String, default: "" },       // 出現時間（任意）
}, { timestamps: true });

module.exports = mongoose.model("FearReport", FearReportSchema);
