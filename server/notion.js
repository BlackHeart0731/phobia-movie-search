// server/notion.js

const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_SECRET, // .envから取得
});

const databaseId = process.env.NOTION_DATABASE_ID;

const addReportToNotion = async (report) => {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // データベースのプロパティ名に合わせて調整してください
        "映画ID": {
          title: [
            {
              text: {
                content: report.movieId || "不明",
              },
            },
          ],
        },
        "恐怖要素": {
          multi_select: report.types.map((type) => ({ name: type })),
        },
        "詳細": {
          rich_text: [
            {
              text: {
                content: report.detail,
              },
            },
          ],
        },
        "出現時間": {
          rich_text: [
            {
              text: {
                content: report.time || "不明",
              },
            },
          ],
        },
      },
    });

    console.log("✅ Notionにデータを追加しました");
  } catch (error) {
    console.error("❌ Notionへの送信エラー:", error.body || error.message);
  }
};

module.exports = { addReportToNotion };