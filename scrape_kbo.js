const https = require('https');

https.get('https://sports.news.naver.com/kbaseball/record/index?category=kbo', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.substring(0, 1000));
  });
}).on('error', (err) => {
  console.error(err);
});
