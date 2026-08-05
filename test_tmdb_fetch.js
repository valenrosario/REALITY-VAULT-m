import https from 'https';

const apiKey = process.env.VITE_TMDB_API_KEY || '4bc8d7b30ec091369b3df9bb3bc88363'; // fallback key if possible
https.get(`https://api.themoviedb.org/3/tv/1396/season/1?api_key=${apiKey}&language=es-MX`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.episodes[0], null, 2));
    } catch(e) {
      console.log(data);
    }
  });
});
