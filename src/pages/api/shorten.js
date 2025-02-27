export const prerender = false;

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const url = formData.get("url");

    console.log("Received URL:", url);

    if (!url) {
      console.error("No URL provided");
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiResponse = await fetch("https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }),
    });

    if (!apiResponse.ok) {
      console.error("CleanURI API error:", await apiResponse.text());
      return new Response(JSON.stringify({ error: "Failed to shorten URL" }), {
        status: apiResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await apiResponse.json();
    console.log("CleanURI Response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
