import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Client } from "npm:@notionhq/client";

const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error("環境変数 NOTION_API_KEY または NOTION_DATABASE_ID が設定されていません");
}

const notion = new Client({ auth: NOTION_API_KEY! });

serve(async (req: Request) => {
  if (req.method === "POST") {
    const body = await req.json();
    const { detail, types, time, movieId } = body;

    if (!detail || !Array.isArray(types) || types.length === 0) {
      return new Response(
        JSON.stringify({ error: "必須項目が不足しています" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const properties: any = {
      "タイトル": {
        title: [{ text: { content: `投稿 - ${new Date().toLocaleString()}` } }],
      },
      "詳細": {
        rich_text: [{ text: { content: detail.trim() } }],
      },
      "恐怖要素タイプ": {
        multi_select: types.map((type: string) => ({ name: type })),
      },
      "投稿日時": {
        date: { start: new Date().toISOString() },
      },
    };

    if (time) {
      properties["出現時間"] = {
        rich_text: [{ text: { content: time } }],
      };
    }

    if (movieId) {
      properties["その他詳細"] = {
        rich_text: [{ text: { content: `Movie ID: ${movieId}` } }],
      };
    }

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASE_ID! },
        properties,
      });

      return new Response(JSON.stringify({ message: "保存成功", id: response.id }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "保存失敗", detail: e instanceof Error ? e.message : String(e) }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "POSTメソッドを使ってください" }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
});
