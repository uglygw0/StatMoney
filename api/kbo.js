import axios from 'axios';

// Vercel Serverless Function - KBO 데이터 연동 (Naver Sports API)
export default async function handler(req, res) {
  try {
    // 1. 한국 시간(KST) 구하기
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const yyyy = kstDate.getUTCFullYear();
    const mm = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(kstDate.getUTCDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    // 2. KBO 리그 순위 가져오기 (Naver API)
    const standingsUrl = `https://api-gw.sports.naver.com/statistics/categories/kbo/seasons/${yyyy}/teams`;
    const standingsRes = await axios.get(standingsUrl, { headers });
    
    if (!standingsRes.data || !standingsRes.data.success || !standingsRes.data.result) {
      throw new Error("순위 데이터를 가져올 수 없습니다.");
    }

    const formatPct = (wra) => {
      const formatted = wra.toFixed(3);
      return formatted.startsWith('0.') ? formatted.substring(1) : formatted;
    };

    const standings = standingsRes.data.result.seasonTeamStats.map(team => ({
      rank: team.ranking,
      team: team.teamName,
      w: team.winGameCount,
      d: team.drawnGameCount,
      l: team.loseGameCount,
      pct: formatPct(team.wra),
      gb: team.gameBehind === 0 ? '-' : team.gameBehind.toFixed(1)
    }));

    // 3. 오늘의 경기 일정 가져오기 (Naver API)
    const scheduleUrl = `https://api-gw.sports.naver.com/schedule/games?upperCategoryId=kbaseball&date=${dateString}`;
    const scheduleRes = await axios.get(scheduleUrl, { headers });
    
    let schedule = [];
    if (scheduleRes.data && scheduleRes.data.success && scheduleRes.data.result && scheduleRes.data.result.games) {
      const kboGames = scheduleRes.data.result.games.filter(g => g.categoryId === 'kbo');
      schedule = kboGames.map(game => {
        let status = game.statusInfo;
        if (!status && game.gameDateTime) {
          const timePart = game.gameDateTime.split('T')[1]?.substring(0, 5) || '';
          status = `${timePart}`;
        }
        return {
          away: game.awayTeamName,
          home: game.homeTeamName,
          status: status || '18:30'
        };
      });
    }

    // 4. 응답 반환
    res.status(200).json({
      success: true,
      data: {
        standings,
        schedule
      }
    });

  } catch (error) {
    console.error('KBO 데이터 로딩 중 에러 발생:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'KBO 데이터를 불러오는 데 실패했습니다.' 
    });
  }
}

