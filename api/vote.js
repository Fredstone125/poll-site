export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { option, category } = req.body;

  if (!option || !category) {
    return res.status(400).json({ error: "Missing data" });
  }

  const value = option.toLowerCase().trim();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // Check if option exists in that category
  const checkRes = await fetch(
    `${supabaseUrl}/rest/v1/polls?name=eq.${value}&category=eq.${category}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    }
  );

  const existing = await checkRes.json();

  if (existing.length > 0) {
    const currentVotes = existing[0].votes;

    await fetch(
      `${supabaseUrl}/rest/v1/polls?name=eq.${value}&category=eq.${category}`,
      {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          votes: currentVotes + 1
        })
      }
    );
  } else {
    await fetch(`${supabaseUrl}/rest/v1/polls`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: value,
        votes: 1,
        category: category
      })
    });
  }

  return res.status(200).json({ success: true });
}
