export default async function handler(req, res) {

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/polls`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });

  const data = await response.json();

  const result = {};
  data.forEach(item => {
    result[item.name] = item.votes;
  });

  res.status(200).json(result);
}
