import { useState, useEffect } from 'react';
import { Home, Users, Settings, Search, TrendingUp, DollarSign, Activity, ChevronUp, ChevronDown, BookOpen, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './App.css';

// --- Default Fallback Data (API 연동 전 시연용) ---
const FALLBACK_STANDINGS = [
  { rank: 1, team: 'KT Wiz', w: 25, d: 1, l: 16, pct: '.610', gb: '0.0' },
  { rank: 2, team: 'LG Twins', w: 25, d: 0, l: 17, pct: '.595', gb: '0.5' },
  { rank: 3, team: 'Samsung Lions', w: 24, d: 1, l: 17, pct: '.585', gb: '1.0' },
  { rank: 4, team: 'SSG Landers', w: 22, d: 1, l: 19, pct: '.537', gb: '3.0' },
  { rank: 5, team: 'KIA Tigers', w: 21, d: 0, l: 21, pct: '.500', gb: '4.5' },
  { rank: 6, team: 'Hanwha Eagles', w: 20, d: 1, l: 21, pct: '.488', gb: '5.0' },
  { rank: 7, team: 'Doosan Bears', w: 20, d: 1, l: 22, pct: '.476', gb: '5.5' },
  { rank: 8, team: 'NC Dinos', w: 18, d: 1, l: 23, pct: '.439', gb: '7.0' },
  { rank: 9, team: 'Kiwoom Heroes', w: 17, d: 0, l: 25, pct: '.405', gb: '8.5' },
  { rank: 10, team: 'Lotte Giants', w: 15, d: 1, l: 25, pct: '.375', gb: '9.5' },
];

const FALLBACK_SCHEDULE = [
  { away: 'Hanwha Eagles', home: 'Kiwoom Heroes', status: '18:30 (고척)' },
  { away: 'NC Dinos', home: 'Lotte Giants', status: '18:30 (사직)' },
  { away: 'Doosan Bears', home: 'KIA Tigers', status: '18:30 (광주)' },
  { away: 'SSG Landers', home: 'KT Wiz', status: '18:30 (수원)' },
  { away: 'Samsung Lions', home: 'LG Twins', status: '18:30 (잠실)' },
];

const PLAYER_DATA = {
  name: 'Kim Ha-seong',
  team: 'San Diego Padres',
  position: 'SS',
  currentSalary: 8000000,
  predictedSalary: 14500000,
  stats: {
    WAR: 4.5,
    OPS: 0.749,
    HR: 17,
    SB: 38
  },
  impactBreakdown: [
    { stat: 'WAR (4.5)', amount: 4500000, desc: '승리기여도' },
    { stat: 'Gold Glove Def', amount: 1200000, desc: '골든글러브급 수비력' },
    { stat: 'OPS (.749)', amount: 500000, desc: '출루율+장타율' },
    { stat: 'Stolen Bases (38)', amount: 300000, desc: '도루 능력' }
  ]
};

// --- Components ---

function StatDictionary() {
  return (
    <div className="card">
      <div className="card-header"><BookOpen size={20} /> 야구 초보자를 위한 스탯 사전</div>
      <div className="dictionary-item">
        <h4>WAR (Wins Above Replacement)</h4>
        <p>대체 선수 대비 승리 기여도입니다. 이 선수가 팀에 몇 승을 더 가져다주었는지 나타내는 가장 종합적인 지표입니다. (1당 약 10억~15억원의 가치로 평가됩니다)</p>
      </div>
      <div className="dictionary-item">
        <h4>OPS (On-base Plus Slugging)</h4>
        <p>출루율과 장타율을 합친 수치입니다. 타자의 득점 생산 능력을 가장 직관적으로 보여줍니다. (0.8 이상이면 훌륭한 타자로 평가받습니다)</p>
      </div>
      <div className="dictionary-item">
        <h4>ERA (Earned Run Average)</h4>
        <p>투수의 평균자책점입니다. 9이닝 동안 평균적으로 몇 점을 내주는지 의미하며, 낮을수록 좋습니다.</p>
      </div>
    </div>
  );
}

function HomeView({ onSearch, standings, schedule, isLoading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="grid-layout">
      {/* Search Bar */}
      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="search-bar" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <Search size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="선수 이름을 검색해보세요 (예: 김하성)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Standings Table */}
      <div className="card" style={{ gridColumn: 'span 8' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> KBO 리그 순위
          </div>
          <button
            onClick={onRefresh}
            style={{
              background: 'transparent', border: 'none', color: '#64748b',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem'
            }}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? '갱신 중...' : '최신 데이터 불러오기'}
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>데이터를 동기화하고 있습니다...</div>
        ) : (
          <table className="standings-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>팀명</th>
                <th>승</th>
                <th>무</th>
                <th>패</th>
                <th>승률</th>
                <th>승차</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <tr key={team.rank}>
                  <td>{team.rank}</td>
                  <td style={{ fontWeight: 600 }}>{team.team}</td>
                  <td>{team.w}</td>
                  <td>{team.d}</td>
                  <td>{team.l}</td>
                  <td>{team.pct}</td>
                  <td>{team.gb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Today's Schedule */}
      <div className="card" style={{ gridColumn: 'span 4' }}>
        <div className="card-header"><TrendingUp size={20} /> 오늘의 경기</div>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>불러오는 중...</div>
        ) : (
          <div>
            {schedule.map((match, idx) => (
              <div className="match-item" key={idx}>
                <div style={{ fontWeight: 600 }}>{match.away}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>VS</div>
                <div style={{ fontWeight: 600 }}>{match.home}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{match.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerAnalyticsView() {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid-layout">
      {/* Player Profile */}
      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="player-profile">
          <div className="player-avatar">KH</div>
          <div className="player-info">
            <h3>{PLAYER_DATA.name} <span className="badge">{PLAYER_DATA.position}</span></h3>
            <p>{PLAYER_DATA.team}</p>
          </div>
        </div>
      </div>

      {/* Salary Prediction Boxes */}
      <div className="card current-salary" style={{ gridColumn: 'span 6' }}>
        <div className="salary-box">
          <div className="label">현재 연봉 (2024)</div>
          <div className="amount">{formatCurrency(PLAYER_DATA.currentSalary)}</div>
        </div>
      </div>

      <div className="card predicted-salary" style={{ gridColumn: 'span 6' }}>
        <div className="salary-box">
          <div className="label">내년 예측 연봉 (2025)</div>
          <div className="amount">{formatCurrency(PLAYER_DATA.predictedSalary)}</div>
          <div style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <ChevronUp size={16} /> {formatCurrency(PLAYER_DATA.predictedSalary - PLAYER_DATA.currentSalary)} 상승 예측
          </div>
        </div>
      </div>

      {/* Stat Impact Chart */}
      <div className="card" style={{ gridColumn: 'span 8' }}>
        <div className="card-header"><DollarSign size={20} /> 스탯별 연봉 영향도 분석</div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PLAYER_DATA.impactBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(val) => `$${val / 1000000}M`} stroke="#64748b" fontSize={12} />
              <YAxis dataKey="stat" type="category" width={120} stroke="#64748b" fontSize={12} />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {PLAYER_DATA.impactBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#16a34a' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dictionary Sidebar */}
      <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">세부 가치 분석</div>
          <div>
            {PLAYER_DATA.impactBreakdown.map((item, idx) => (
              <div className="stat-impact-item" key={idx}>
                <div>
                  <div className="stat-name">{item.stat}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</div>
                </div>
                <div className="stat-amount">+{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        </div>
        <StatDictionary />
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [standings, setStandings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 일일 데이터 갱신을 시뮬레이션하는 함수
  const fetchDailyData = async () => {
    setIsLoading(true);
    try {
      // 1. 여기서 실제 프로덕션 환경이라면 백엔드 API를 호출합니다.
      // 예: const response = await fetch('https://api.statmoney.com/v1/kbo/today');
      //     const data = await response.json();

      // 2. 네트워크 지연 시뮬레이션 (0.8초)
      await new Promise(resolve => setTimeout(resolve, 800));

      // 3. 받아온 데이터를 상태에 저장합니다.
      setStandings(FALLBACK_STANDINGS);
      setSchedule(FALLBACK_SCHEDULE);

    } catch (error) {
      console.error("데이터 갱신 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 (매일 첫 접속 시) 데이터 불러오기 및 자정마다 갱신 설정
  useEffect(() => {
    fetchDailyData();

    // 다음 자정까지 남은 밀리초 계산
    const getMsUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      return midnight.getTime() - now.getTime();
    };

    let timeoutId;

    const scheduleMidnightRefresh = () => {
      const msUntilMidnight = getMsUntilMidnight();
      timeoutId = setTimeout(() => {
        fetchDailyData();
        scheduleMidnightRefresh(); // 갱신 후 다음 날 자정을 위해 다시 스케줄링
      }, msUntilMidnight);
    };

    scheduleMidnightRefresh();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="logo">
          <TrendingUp color="#2563eb" /> StatMoney
        </div>
        <div className="nav-menu">
          <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={20} /> 홈 화면
          </div>
          <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Users size={20} /> 선수 연봉 분석
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> 설정
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2>
            {activeTab === 'home' && '대시보드'}
            {activeTab === 'analytics' && '선수 연봉 분석'}
            {activeTab === 'settings' && '설정'}
          </h2>
        </header>

        {activeTab === 'home' && (
          <HomeView
            onSearch={() => setActiveTab('analytics')}
            standings={standings}
            schedule={schedule}
            isLoading={isLoading}
            onRefresh={fetchDailyData}
          />
        )}
        {activeTab === 'analytics' && <PlayerAnalyticsView />}
        {activeTab === 'settings' && (
          <div className="card">
            <div className="card-header">환경 설정</div>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>앱 설정 기능 (추후 업데이트 예정)</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
