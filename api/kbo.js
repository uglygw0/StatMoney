import axios from 'axios';
import * as cheerio from 'cheerio';

// Vercel Serverless Function - KBO 데이터 크롤링
export default async function handler(req, res) {
  try {
    // 1. KBO 공식 홈페이지 순위표 크롤링
    const { data } = await axios.get('https://www.koreabaseball.com/TeamRank/TeamRank.aspx', {
        headers: {
            // 차단을 막기 위해 일반 브라우저처럼 보이게 User-Agent 설정
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    const $ = cheerio.load(data);
    const standings = [];
    
    // KBO 사이트의 데이터 테이블 선택자
    const rows = $('.tData tbody tr');
    
    if (rows.length > 0) {
      rows.each((i, el) => {
        // 첫 10개 행(1위~10위)만 가져옴
        if (i >= 10) return;
        
        const rank = $(el).find('td:nth-child(1)').text().trim();
        const team = $(el).find('td:nth-child(2)').text().trim();
        const w = $(el).find('td:nth-child(4)').text().trim(); // 승
        const l = $(el).find('td:nth-child(5)').text().trim(); // 패
        const d = $(el).find('td:nth-child(6)').text().trim(); // 무
        const pct = $(el).find('td:nth-child(7)').text().trim(); // 승률
        const gb = $(el).find('td:nth-child(8)').text().trim(); // 게임차

        if(team) {
          standings.push({ rank, team, w, d, l, pct, gb });
        }
      });
    }

    // 일정 정보 더미 데이터 (마찬가지로 크롤링 가능하나, 예시로 유지)
    const schedule = [
      { away: 'Hanwha Eagles', home: 'Kiwoom Heroes', status: '18:30 (고척)' },
      { away: 'NC Dinos', home: 'Lotte Giants', status: '18:30 (사직)' },
      { away: 'Doosan Bears', home: 'KIA Tigers', status: '18:30 (광주)' },
      { away: 'SSG Landers', home: 'KT Wiz', status: '18:30 (수원)' },
      { away: 'Samsung Lions', home: 'LG Twins', status: '18:30 (잠실)' },
    ];

    // 크롤링 실패 시 안전장치 (데이터 구조가 바뀌었을 때)
    if (standings.length === 0) {
      throw new Error("크롤링 데이터가 비어있습니다. 사이트 구조가 변경되었을 수 있습니다.");
    }

    // 응답 반환
    res.status(200).json({
      success: true,
      data: {
        standings,
        schedule
      }
    });

  } catch (error) {
    console.error('KBO 크롤링 중 에러 발생:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'KBO 데이터를 불러오는 데 실패했습니다.' 
    });
  }
}

