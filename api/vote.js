export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { option } = req.body;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // Step 1: Get current vote count
  const getResponse = await fetch(
    `${supabaseUrl}/rest/v1/polls?name=eq.${option}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    }
  );

  const data = await getResponse.json();

  if (!data.length) {
    return res.status(400).json({ error: "Invalid option" });
  }

  const currentVotes = data[0].votes;

  // Step 2: Update vote count
  await fetch(
    `${supabaseUrl}/rest/v1/polls?name=eq.${option}`,
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

  return res.status(200).json({ success: true });
}
