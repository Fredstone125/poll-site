export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, time } = req.body;

  if (!name || !time) {
    return res.status(400).json({ error: "Missing data" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // Check if user already exists
  const checkRes = await fetch(
    `${supabaseUrl}/rest/v1/reaction_scores?name=eq.${name}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    }
  );

  const existing = await checkRes.json();

  if (existing.length > 0) {
    const currentBest = existing[0].time;

    // Only update if new time is faster
    if (time < currentBest) {
      await fetch(
        `${supabaseUrl}/rest/v1/reaction_scores?name=eq.${name}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ time })
        }
      );
    }
  } else {
    await fetch(`${supabaseUrl}/rest/v1/reaction_scores`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, time })
    });
  }

  res.status(200).json({ success: true });
}
