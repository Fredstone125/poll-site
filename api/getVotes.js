export default async function handler(req, res) {

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/polls?order=votes.desc`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    }
  );

  const data = await response.json();

  res.status(200).json(data);
}
