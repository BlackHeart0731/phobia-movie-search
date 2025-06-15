const worker = {
  async fetch(request) {
    if (request.method === "POST" && new URL(request.url).pathname === "/report") {
      const data = await request.json();
      return new Response(
        JSON.stringify({
          message: "受け取りました",
          received: data,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("Hello from Workers!");
  },
};

export default worker;
