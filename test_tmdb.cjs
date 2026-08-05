const https = require('https');
https.get("https://api.themoviedb.org/3/tv/1396/season/1?api_key=your_api_key&language=es-MX", (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.substring(0, 500)));
});
