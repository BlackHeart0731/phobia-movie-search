// testNotion.js
require('dotenv').config();  // .envの中身を読み込む

const notion = require('./notionClient');  // さっき作った窓口を使う

const databaseId = process.env.NOTION_DATABASE_ID;  // ここも.envに書いてあるよ

async function queryDatabase() {
  try {
    // データベースからデータを5件だけ取ってくるよ
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 5,
    });
    // 取ってきたデータを画面に表示
    console.log("データベースの中身：", JSON.stringify(response.results, null, 2));
  } catch (error) {
    console.error("APIエラー:", error.body || error);
  }
}

queryDatabase();
