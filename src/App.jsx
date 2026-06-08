import { useState, useEffect } from 'react';
import { Home, Users, Settings, Search, TrendingUp, DollarSign, Activity, ChevronUp, ChevronDown, BookOpen, RefreshCw, Sliders, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './App.css';

// --- Default Fallback Data (API 연동 전 시연용) ---
const FALLBACK_STANDINGS = [
  { rank: 1, team: 'LG', w: 36, d: 0, l: 23, pct: '.610', gb: '-' },
  { rank: 2, team: 'KT', w: 34, d: 1, l: 24, pct: '.586', gb: '1.5' },
  { rank: 3, team: '삼성', w: 33, d: 1, l: 24, pct: '.579', gb: '2.0' },
  { rank: 4, team: 'KIA', w: 32, d: 1, l: 27, pct: '.542', gb: '4.0' },
  { rank: 5, team: '한화', w: 30, d: 1, l: 27, pct: '.526', gb: '5.0' },
  { rank: 6, team: '두산', w: 29, d: 2, l: 29, pct: '.500', gb: '6.5' },
  { rank: 7, team: 'NC', w: 26, d: 1, l: 31, pct: '.456', gb: '9.0' },
  { rank: 8, team: 'SSG', w: 26, d: 1, l: 32, pct: '.448', gb: '9.5' },
  { rank: 9, team: '롯데', w: 22, d: 1, l: 35, pct: '.386', gb: '13.0' },
  { rank: 10, team: '키움', w: 22, d: 1, l: 38, pct: '.367', gb: '14.5' },
];

const FALLBACK_SCHEDULE = [];

const PLAYERS_DB = {
  '김도영': {
    name: '김도영',
    team: 'KIA 타이거즈',
    position: '3B',
    currentSalary: 250000000,
    predictedSalary: 650000000,
    currency: 'KRW',
    stats: { WAR: 7.2, OPS: 1.067, HR: 38, SB: 40 },
    impactBreakdown: [
      { stat: 'WAR (7.2)', amount: 280000000, desc: '승리기여도' },
      { stat: 'OPS (1.067)', amount: 60000000, desc: '출루율+장타율' },
      { stat: 'HR (38)', amount: 40000000, desc: '홈런 생산력' },
      { stat: 'SB (40)', amount: 20000000, desc: '주력 및 도루 능력' }
    ]
  },
  '김하성': {
    name: '김하성',
    team: 'San Diego Padres',
    position: 'SS',
    currentSalary: 8000000,
    predictedSalary: 14500000,
    currency: 'USD',
    stats: { WAR: 4.5, OPS: 0.749, HR: 17, SB: 38 },
    impactBreakdown: [
      { stat: 'WAR (4.5)', amount: 4500000, desc: '승리기여도' },
      { stat: 'Gold Glove Def', amount: 1200000, desc: '골든글러브급 수비력' },
      { stat: 'OPS (.749)', amount: 500000, desc: '출루율+장타율' },
      { stat: 'Stolen Bases (38)', amount: 300000, desc: '도루 능력' }
    ]
  },
  '이대호': {
    name: '이대호',
    team: '롯데 자이언츠',
    position: '1B/DH',
    currentSalary: 2500000000,
    predictedSalary: 2700000000,
    currency: 'KRW',
    stats: { WAR: 5.2, OPS: 0.980, HR: 30, RBI: 110 },
    impactBreakdown: [
      { stat: 'WAR (5.2)', amount: 100000000, desc: '승리기여도' },
      { stat: 'OPS (.980)', amount: 50000000, desc: '출루율+장타율' },
      { stat: 'HR (30)', amount: 30000000, desc: '홈런 생산력' },
      { stat: 'RBI (110)', amount: 20000000, desc: '타점 생산력' }
    ]
  },
  '이승엽': {
    name: '이승엽',
    team: '삼성 라이온즈',
    position: '1B',
    currentSalary: 1500000000,
    predictedSalary: 1800000000,
    currency: 'KRW',
    stats: { WAR: 6.5, OPS: 1.050, HR: 40, RBI: 120 },
    impactBreakdown: [
      { stat: 'WAR (6.5)', amount: 150000000, desc: '승리기여도' },
      { stat: 'OPS (1.050)', amount: 80000000, desc: '출루율+장타율' },
      { stat: 'HR (40)', amount: 50000000, desc: '홈런 생산력' },
      { stat: 'Star Power', amount: 20000000, desc: '스타성' }
    ]
  },
  '최정': {
    name: '최정',
    team: 'SSG 랜더스',
    position: '3B',
    currentSalary: 2000000000,
    predictedSalary: 2200000000,
    currency: 'KRW',
    stats: { WAR: 5.8, OPS: 0.950, HR: 35, RBI: 100 },
    impactBreakdown: [
      { stat: 'WAR (5.8)', amount: 120000000, desc: '승리기여도' },
      { stat: 'OPS (.950)', amount: 40000000, desc: '출루율+장타율' },
      { stat: 'HR (35)', amount: 40000000, desc: '홈런 생산력' }
    ]
  },
  '박용택': {
    name: '박용택',
    team: 'LG 트윈스',
    position: 'OF/DH',
    currentSalary: 1000000000,
    predictedSalary: 1200000000,
    currency: 'KRW',
    stats: { WAR: 4.5, OPS: 0.890, AVG: 0.330, RBI: 80 },
    impactBreakdown: [
      { stat: 'WAR (4.5)', amount: 100000000, desc: '승리기여도' },
      { stat: 'AVG (.330)', amount: 60000000, desc: '타율' },
      { stat: 'OPS (.890)', amount: 40000000, desc: '출루율+장타율' }
    ]
  },
  '나지완': {
    name: '나지완',
    team: 'KIA 타이거즈',
    position: 'OF/DH',
    currentSalary: 600000000,
    predictedSalary: 750000000,
    currency: 'KRW',
    stats: { WAR: 3.5, OPS: 0.850, HR: 20, RBI: 70 },
    impactBreakdown: [
      { stat: 'WAR (3.5)', amount: 80000000, desc: '승리기여도' },
      { stat: 'OPS (.850)', amount: 40000000, desc: '출루율+장타율' },
      { stat: 'HR (20)', amount: 30000000, desc: '홈런 생산력' }
    ]
  }
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
        ) : schedule.length === 0 ? (
          <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>오늘은 예정된 경기가 없습니다.</div>
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

function PlayerAnalyticsView({ playerData }) {
  if (!playerData) return null;

  const currency = playerData.currency || 'USD';
  const formatCurrency = (val) => {
    if (currency === 'KRW') {
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(val);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const chartTickFormatter = (val) => {
    if (currency === 'KRW') {
      return `${val / 100000000}억`;
    }
    return `$${val / 1000000}M`;
  };

  return (
    <div className="grid-layout">
      {/* Player Profile */}
      <div className="card" style={{ gridColumn: 'span 12' }}>
        <div className="player-profile">
          <div className="player-avatar">{playerData.name.substring(0, 2)}</div>
          <div className="player-info">
            <h3>{playerData.name} <span className="badge">{playerData.position}</span></h3>
            <p>{playerData.team}</p>
          </div>
        </div>
      </div>

      {/* Salary Prediction Boxes */}
      <div className="card current-salary" style={{ gridColumn: 'span 6' }}>
        <div className="salary-box">
          <div className="label">현재 연봉 (2024)</div>
          <div className="amount">{formatCurrency(playerData.currentSalary)}</div>
        </div>
      </div>

      <div className="card predicted-salary" style={{ gridColumn: 'span 6' }}>
        <div className="salary-box">
          <div className="label">내년 예측 연봉 (2025)</div>
          <div className="amount">{formatCurrency(playerData.predictedSalary)}</div>
          <div style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            <ChevronUp size={16} /> {formatCurrency(playerData.predictedSalary - playerData.currentSalary)} 상승 예측
          </div>
        </div>
      </div>

      {/* Stat Impact Chart */}
      <div className="card" style={{ gridColumn: 'span 8' }}>
        <div className="card-header"><DollarSign size={20} /> 스탯별 연봉 영향도 분석</div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={playerData.impactBreakdown} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tickFormatter={chartTickFormatter} stroke="#64748b" fontSize={12} />
              <YAxis dataKey="stat" type="category" width={120} stroke="#64748b" fontSize={12} />
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {playerData.impactBreakdown.map((entry, index) => (
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
            {playerData.impactBreakdown.map((item, idx) => (
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

function SalarySimulatorView() {
  const [selectedPreset, setSelectedPreset] = useState('김도영');
  const [currency, setCurrency] = useState('KRW');
  const [playerStats, setPlayerStats] = useState({
    name: '김도영',
    currentSalary: 250000000,
    fa: 0,
    years: 4,
    xr: 48,
    mh: 17,
    age: 23,
    gw_rbi: 6,
    bb_k: 0.87,
    so: 38,
    ibb: 4,
    sac_neg: 2,
    triple: 1,
    go_ao: 0.73
  });

  const DEFAULT_WEIGHTS = {
    USD: {
      baseSalary: 740000,
      scaleFactor: 1000000,
      fa: 0.143,
      years: 0.117,
      xr: 0.079,
      mh: 0.047,
      age: 0.039,
      gw_rbi: 0.034,
      bb_k: 0.031,
      so: 0.029,
      ibb: 0.029,
      sac_neg: -0.150,
      triple: -0.226,
      go_ao: -0.124
    },
    KRW: {
      baseSalary: 30000000,
      scaleFactor: 100000000,
      fa: 0.143,
      years: 0.117,
      xr: 0.079,
      mh: 0.047,
      age: 0.039,
      gw_rbi: 0.034,
      bb_k: 0.031,
      so: 0.029,
      ibb: 0.029,
      sac_neg: -0.150,
      triple: -0.226,
      go_ao: -0.124
    }
  };

  const SLIDER_CONFIGS = {
    USD: {
      baseSalary: { min: 100000, max: 5000000, step: 50000, label: '기본 보장 급여 ($)', unit: 'USD' },
      scaleFactor: { min: 100000, max: 10000000, step: 100000, label: '단위 스케일 팩터 ($)', unit: 'USD' },
      fa: { min: -1.0, max: 1.0, step: 0.001, label: 'FA여부 가중치' },
      years: { min: -1.0, max: 1.0, step: 0.001, label: '연차 가중치' },
      xr: { min: -1.0, max: 1.0, step: 0.001, label: 'XR 가중치' },
      mh: { min: -1.0, max: 1.0, step: 0.001, label: 'MH 가중치' },
      age: { min: -1.0, max: 1.0, step: 0.001, label: '나이 가중치' },
      gw_rbi: { min: -1.0, max: 1.0, step: 0.001, label: 'GW RBI 가중치' },
      bb_k: { min: -1.0, max: 1.0, step: 0.001, label: 'BB/K 가중치' },
      so: { min: -1.0, max: 1.0, step: 0.001, label: 'SO 가중치' },
      ibb: { min: -1.0, max: 1.0, step: 0.001, label: 'IBB 가중치' },
      sac_neg: { min: -1.0, max: 1.0, step: 0.001, label: '희생타 가중치' },
      triple: { min: -1.0, max: 1.0, step: 0.001, label: '3B 가중치' },
      go_ao: { min: -1.0, max: 1.0, step: 0.001, label: 'GO/AO 가중치' }
    },
    KRW: {
      baseSalary: { min: 10000000, max: 2000000000, step: 5000000, label: '기본 보장 급여 (원)', unit: '원' },
      scaleFactor: { min: 10000000, max: 1000000000, step: 10000000, label: '단위 스케일 팩터 (원)', unit: '원' },
      fa: { min: -1.0, max: 1.0, step: 0.001, label: 'FA여부 가중치' },
      years: { min: -1.0, max: 1.0, step: 0.001, label: '연차 가중치' },
      xr: { min: -1.0, max: 1.0, step: 0.001, label: 'XR 가중치' },
      mh: { min: -1.0, max: 1.0, step: 0.001, label: 'MH 가중치' },
      age: { min: -1.0, max: 1.0, step: 0.001, label: '나이 가중치' },
      gw_rbi: { min: -1.0, max: 1.0, step: 0.001, label: 'GW RBI 가중치' },
      bb_k: { min: -1.0, max: 1.0, step: 0.001, label: 'BB/K 가중치' },
      so: { min: -1.0, max: 1.0, step: 0.001, label: 'SO 가중치' },
      ibb: { min: -1.0, max: 1.0, step: 0.001, label: 'IBB 가중치' },
      sac_neg: { min: -1.0, max: 1.0, step: 0.001, label: '희생타 가중치' },
      triple: { min: -1.0, max: 1.0, step: 0.001, label: '3B 가중치' },
      go_ao: { min: -1.0, max: 1.0, step: 0.001, label: 'GO/AO 가중치' }
    }
  };

  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS.KRW });

  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) return;
    setCurrency(newCurrency);
    setWeights({ ...DEFAULT_WEIGHTS[newCurrency] });

    if (newCurrency === 'USD') {
      setPlayerStats(prev => ({
        ...prev,
        currentSalary: Math.round(prev.currentSalary / 1300 / 10000) * 10000 || 100000
      }));
    } else {
      setPlayerStats(prev => ({
        ...prev,
        currentSalary: Math.round(prev.currentSalary * 1300 / 10000000) * 10000000 || 30000000
      }));
    }
    setSelectedPreset('custom');
  };

  const handlePresetChange = (e) => {
    const presetName = e.target.value;
    setSelectedPreset(presetName);
    if (presetName === 'custom') return;

    const player = PLAYERS_DB[presetName];
    if (player) {
      const pCurrency = player.currency || 'KRW';
      setCurrency(pCurrency);
      setWeights({ ...DEFAULT_WEIGHTS[pCurrency] });

      const stats = player.stats || {};
      const hr = stats.HR || 15;
      const rbi = stats.RBI || 60;
      const war = stats.WAR || 3.0;
      const ops = stats.OPS || 0.750;

      setPlayerStats({
        name: player.name,
        currentSalary: player.currentSalary,
        fa: presetName === '김하성' || presetName === '김도영' ? 0 : 1,
        years: presetName === '김도영' ? 4 : (presetName === '이승엽' || presetName === '이대호' ? 15 : (presetName === '김하성' ? 7 : 10)),
        xr: presetName === '김도영' ? 48 : (Math.round((ops * 60 + war * 2) * 10) / 10),
        mh: presetName === '김도영' ? 17 : (Math.round(stats.AVG ? stats.AVG * 400 : 35)),
        age: presetName === '김도영' ? 23 : (presetName === '김하성' ? 29 : (presetName === '이승엽' ? 38 : 34)),
        gw_rbi: presetName === '김도영' ? 6 : (Math.round(rbi * 0.1) || 6),
        bb_k: presetName === '김도영' ? 0.87 : (Math.round((ops - 0.2) * 1.2 * 100) / 100),
        so: presetName === '김도영' ? 38 : (Math.round(100 - ops * 40) || 70),
        ibb: presetName === '김도영' ? 4 : (Math.round(rbi / 20) || 2),
        sac_neg: presetName === '김도영' ? 2 : 1,
        triple: presetName === '김하성' ? 3 : (presetName === '김도영' ? 1 : 1),
        go_ao: presetName === '김도영' ? 0.73 : 1.1
      });
    }
  };

  const handleStatChange = (field, val) => {
    let numVal = parseFloat(val);
    if (isNaN(numVal)) {
      setPlayerStats(prev => ({ ...prev, [field]: val }));
    } else {
      setPlayerStats(prev => ({ ...prev, [field]: numVal }));
    }
    setSelectedPreset('custom');
  };

  const handleWeightChange = (field, val) => {
    const numVal = parseFloat(val);
    setWeights(prev => ({
      ...prev,
      [field]: isNaN(numVal) ? 0 : numVal
    }));
  };

  const resetWeights = () => {
    setWeights({ ...DEFAULT_WEIGHTS[currency] });
  };

  const calculateResult = () => {
    const base = parseFloat(weights.baseSalary) || 0;
    const scale = parseFloat(weights.scaleFactor) || 1;

    const faVal = parseFloat(playerStats.fa) || 0;
    const faContrib = faVal * (parseFloat(weights.fa) || 0);

    const yearsVal = parseFloat(playerStats.years) || 0;
    const yearsContrib = yearsVal * (parseFloat(weights.years) || 0);

    const xrVal = parseFloat(playerStats.xr) || 0;
    const xrContrib = xrVal * (parseFloat(weights.xr) || 0);

    const mhVal = parseFloat(playerStats.mh) || 0;
    const mhContrib = mhVal * (parseFloat(weights.mh) || 0);

    const ageVal = parseFloat(playerStats.age) || 0;
    let ageScore = ageVal * (parseFloat(weights.age) || 0);
    if (ageVal > 40) {
      // 40세 초과 시 에이징 커브 패널티 적용 (42->43세 감소폭보다 43->44세 감소폭이 더 커짐)
      const ageOver40 = ageVal - 40;
      const penalty = 0.015 * Math.pow(ageOver40, 1.8);
      ageScore -= penalty;
    }
    const ageContrib = ageScore;

    const gwRbiVal = parseFloat(playerStats.gw_rbi) || 0;
    const gwRbiContrib = gwRbiVal * (parseFloat(weights.gw_rbi) || 0);

    const bbKVal = parseFloat(playerStats.bb_k) || 0;
    const bbKContrib = bbKVal * (parseFloat(weights.bb_k) || 0);

    const soVal = parseFloat(playerStats.so) || 0;
    const soContrib = soVal * (parseFloat(weights.so) || 0);

    const ibbVal = parseFloat(playerStats.ibb) || 0;
    const ibbContrib = ibbVal * (parseFloat(weights.ibb) || 0);

    const sacNegVal = parseFloat(playerStats.sac_neg) || 0;
    const sacNegContrib = sacNegVal * (parseFloat(weights.sac_neg) || 0);

    const tripleVal = parseFloat(playerStats.triple) || 0;
    const tripleContrib = tripleVal * (parseFloat(weights.triple) || 0);

    const goAoVal = parseFloat(playerStats.go_ao) || 0;
    const goAoContrib = goAoVal * (parseFloat(weights.go_ao) || 0);

    const scoreSum = faContrib + yearsContrib + xrContrib + mhContrib + ageContrib + 
                     gwRbiContrib + bbKContrib + soContrib + ibbContrib + sacNegContrib + tripleContrib + goAoContrib;

    const predicted = base + scoreSum * scale;

    return {
      predictedSalary: Math.max(0, Math.round(predicted)),
      breakdown: [
        { name: '기본 보장', amount: base, rawName: 'base' },
        { name: `FA여부 (${faVal})`, amount: faContrib * scale, rawName: 'fa' },
        { name: `연차 (${yearsVal}년)`, amount: yearsContrib * scale, rawName: 'years' },
        { name: `XR (${xrVal})`, amount: xrContrib * scale, rawName: 'xr' },
        { name: `MH (${mhVal})`, amount: mhContrib * scale, rawName: 'mh' },
        { name: `나이 (${ageVal}세)`, amount: ageContrib * scale, rawName: 'age' },
        { name: `GW RBI (${gwRbiVal})`, amount: gwRbiContrib * scale, rawName: 'gw_rbi' },
        { name: `BB/K (${bbKVal})`, amount: bbKContrib * scale, rawName: 'bb_k' },
        { name: `SO (${soVal})`, amount: soContrib * scale, rawName: 'so' },
        { name: `IBB (${ibbVal})`, amount: ibbContrib * scale, rawName: 'ibb' },
        { name: `희생타 (${sacNegVal})`, amount: sacNegContrib * scale, rawName: 'sac_neg' },
        { name: `3B (${tripleVal})`, amount: tripleContrib * scale, rawName: 'triple' },
        { name: `GO/AO (${goAoVal})`, amount: goAoContrib * scale, rawName: 'go_ao' }
      ]
    };
  };

  const { predictedSalary, breakdown } = calculateResult();

  const formatCurrency = (val) => {
    if (currency === 'KRW') {
      if (val >= 100000000) {
        const eok = Math.floor(val / 100000000);
        const man = Math.round((val % 100000000) / 10000);
        return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
      }
      return `${Math.round(val / 10000).toLocaleString()}만원`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatWeightValue = (key, val) => {
    if (key === 'baseSalary' || key === 'scaleFactor') {
      return formatCurrency(val);
    }
    return val > 0 ? `+${val.toFixed(3)}` : val.toFixed(3);
  };

  const chartTickFormatter = (val) => {
    if (currency === 'KRW') {
      return `${val / 100000000}억`;
    }
    return `$${val / 1000000}M`;
  };

  const diff = predictedSalary - (parseFloat(playerStats.currentSalary) || 0);
  const isUp = diff >= 0;

  const getCommentary = () => {
    const sortedContrib = [...breakdown.slice(1)].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    const topContrib = sortedContrib[0];
    
    let text = `예측 연봉은 <strong>${formatCurrency(predictedSalary)}</strong>으로 산출되었습니다. `;
    if (topContrib && Math.abs(topContrib.amount) > 0) {
      text += `현재 입력값과 가중치 기준, 가장 큰 연쇄 영향을 준 항목은 <strong>${topContrib.name} (${formatCurrency(topContrib.amount)})</strong>입니다. `;
    }
    
    text += `가중치가 높은 FA여부(가중치: ${weights.fa}) 및 연차(가중치: ${weights.years})가 예측값 상승의 핵심 축 역할을 하고 있습니다.`;
    return text;
  };

  return (
    <div className="grid-layout">
      {/* Settings Panel */}
      <div className="card" style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card-header" style={{ justifyContent: 'space-between', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} /> 가중치 및 스탯 설정
          </div>
          <div className="currency-toggle-group">
            <button 
              className={`toggle-btn ${currency === 'KRW' ? 'active' : ''}`}
              onClick={() => handleCurrencyChange('KRW')}
            >
              KRW (원)
            </button>
            <button 
              className={`toggle-btn ${currency === 'USD' ? 'active' : ''}`}
              onClick={() => handleCurrencyChange('USD')}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="form-group-preset">
          <label>기존 선수 데이터 불러오기</label>
          <select value={selectedPreset} onChange={handlePresetChange} className="preset-select">
            <option value="custom">👤 직접 입력 (Custom)</option>
            {Object.keys(PLAYERS_DB).map(name => (
              <option key={name} value={name}>⚾️ {name} ({PLAYERS_DB[name].team})</option>
            ))}
          </select>
        </div>

        <div className="separator"></div>

        {/* Player Stats Form */}
        <div className="simulator-section">
          <h4 className="section-title">1. 선수 기본 정보 및 스탯</h4>
          <div className="stats-input-grid">
            <div className="form-group">
              <label>선수 이름</label>
              <input 
                type="text" 
                value={playerStats.name} 
                onChange={(e) => setPlayerStats(prev => ({ ...prev, name: e.target.value }))}
                placeholder="예: 홍길동"
              />
            </div>
            <div className="form-group">
              <label>현재 연봉 ({currency === 'KRW' ? '원' : '$'})</label>
              <input 
                type="number" 
                value={playerStats.currentSalary} 
                onChange={(e) => handleStatChange('currentSalary', e.target.value)}
                placeholder="현재 연봉 입력"
              />
            </div>
            <div className="form-group">
              <label>FA 여부</label>
              <select 
                value={playerStats.fa} 
                onChange={(e) => handleStatChange('fa', e.target.value)}
                className="preset-select"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
              >
                <option value={0}>❌ 비대상 (0)</option>
                <option value={1}>✔️ FA 대상 (1)</option>
              </select>
            </div>
            <div className="form-group">
              <label>연차 (년)</label>
              <input 
                type="number" 
                value={playerStats.years} 
                onChange={(e) => handleStatChange('years', e.target.value)}
                placeholder="예: 5"
              />
            </div>
            <div className="form-group">
              <label>XR (득점공헌도)</label>
              <input 
                type="number" 
                step="0.1"
                value={playerStats.xr} 
                onChange={(e) => handleStatChange('xr', e.target.value)}
                placeholder="예: 45.2"
              />
            </div>
            <div className="form-group">
              <label>MH (멀티히트)</label>
              <input 
                type="number" 
                value={playerStats.mh} 
                onChange={(e) => handleStatChange('mh', e.target.value)}
                placeholder="예: 30"
              />
            </div>
            <div className="form-group">
              <label>나이 (세)</label>
              <input 
                type="number" 
                value={playerStats.age} 
                onChange={(e) => handleStatChange('age', e.target.value)}
                placeholder="예: 28"
              />
            </div>
            <div className="form-group">
              <label>GW RBI (결승타)</label>
              <input 
                type="number" 
                value={playerStats.gw_rbi} 
                onChange={(e) => handleStatChange('gw_rbi', e.target.value)}
                placeholder="예: 5"
              />
            </div>
            <div className="form-group">
              <label>BB/K (볼넷/삼진)</label>
              <input 
                type="number" 
                step="0.01"
                value={playerStats.bb_k} 
                onChange={(e) => handleStatChange('bb_k', e.target.value)}
                placeholder="예: 0.85"
              />
            </div>
            <div className="form-group">
              <label>SO (삼진)</label>
              <input 
                type="number" 
                value={playerStats.so} 
                onChange={(e) => handleStatChange('so', e.target.value)}
                placeholder="예: 70"
              />
            </div>
            <div className="form-group">
              <label>IBB (고의사구)</label>
              <input 
                type="number" 
                value={playerStats.ibb} 
                onChange={(e) => handleStatChange('ibb', e.target.value)}
                placeholder="예: 2"
              />
            </div>
            <div className="form-group">
              <label>희생타 (SAC)</label>
              <input 
                type="number" 
                value={playerStats.sac_neg} 
                onChange={(e) => handleStatChange('sac_neg', e.target.value)}
                placeholder="예: 1"
              />
            </div>
            <div className="form-group">
              <label>3B (3루타)</label>
              <input 
                type="number" 
                value={playerStats.triple} 
                onChange={(e) => handleStatChange('triple', e.target.value)}
                placeholder="예: 2"
              />
            </div>
            <div className="form-group">
              <label>GO/AO (땅볼/뜬공)</label>
              <input 
                type="number" 
                step="0.01"
                value={playerStats.go_ao} 
                onChange={(e) => handleStatChange('go_ao', e.target.value)}
                placeholder="예: 1.05"
              />
            </div>
          </div>
        </div>

        <div className="separator"></div>

        {/* Weights Sliders */}
        <div className="simulator-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 className="section-title" style={{ margin: 0 }}>2. 스탯별 예측 가중치 (XGBoost 근사치)</h4>
            <button className="reset-btn" onClick={resetWeights}>기본값 복원</button>
          </div>
          
          <div className="sliders-list">
            {Object.keys(SLIDER_CONFIGS[currency]).map((key) => {
              const cfg = SLIDER_CONFIGS[currency][key];
              return (
                <div className="slider-item" key={key}>
                  <div className="slider-label-row">
                    <span className="slider-label">{cfg.label}</span>
                    <span className="slider-value">{formatWeightValue(key, weights[key])}</span>
                  </div>
                  <div className="slider-control-row">
                    <input 
                      type="range" 
                      min={cfg.min} 
                      max={cfg.max} 
                      step={cfg.step}
                      value={weights[key]} 
                      onChange={(e) => handleWeightChange(key, e.target.value)}
                      className="styled-slider"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="card" style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card-header">
          <Activity size={20} /> 실시간 연봉 예측 결과
        </div>

        {/* Result Amount display */}
        <div className="predicted-result-card">
          <div className="player-summary-line">
            <span className="player-name-badge">{playerStats.name || '무명 선수'}</span> 내년 예측 연봉 (2025)
          </div>
          <div className="result-salary-amount">
            {formatCurrency(predictedSalary)}
          </div>
          <div className={`result-diff-badge ${isUp ? 'positive' : 'negative'}`}>
            {isUp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {formatCurrency(Math.abs(diff))} {isUp ? '상승' : '하락'} (현재 연봉 대비)
          </div>
        </div>

        {/* Recharts dynamic contribution bar chart */}
        <div className="chart-section">
          <div className="chart-title">스탯별 연봉 기여도 분석</div>
          <div style={{ height: '420px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={breakdown} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickFormatter={chartTickFormatter} stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" width={130} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)} 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px' }} 
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {breakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.rawName === 'base' ? '#475569' : (entry.amount >= 0 ? '#16a34a' : '#dc2626')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formula breakdown and Dynamic Commentary */}
        <div className="simulator-commentary">
          <div className="commentary-title">ℹ️ AI 분석 리포트</div>
          <p dangerouslySetInnerHTML={{ __html: getCommentary() }}></p>
        </div>

        <div className="formula-explanation-box">
          <div className="formula-title">📐 예측 연산 공식 안내</div>
          <code className="formula-code">
            예측 연봉 = 기본급 + ( ∑(각 변수값 × 해당 가중치) × 단위 스케일 팩터 )
          </code>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [standings, setStandings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 서버리스 API로부터 데이터를 받아오는 함수
  const fetchDailyData = async () => {
    setIsLoading(true);
    try {
      // Vercel Serverless Function 호출
      const response = await fetch('/api/kbo');

      if (!response.ok) {
        throw new Error(`API 요청 에러: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setStandings(result.data.standings);
        setSchedule(result.data.schedule);
      } else {
        throw new Error(result.message || '데이터를 가져오는데 실패했습니다.');
      }

    } catch (error) {
      console.error("데이터 갱신 실패:", error);
      // 에러 발생 시 (예: 로컬 환경 등) 하드코딩된 더미 데이터(FALLBACK) 사용
      setStandings(FALLBACK_STANDINGS);
      setSchedule(FALLBACK_SCHEDULE);
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
          <div className={`nav-item ${activeTab === 'simulator' ? 'active' : ''}`} onClick={() => setActiveTab('simulator')}>
            <Calculator size={20} /> 연봉 시뮬레이터
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
            {activeTab === 'simulator' && '연봉 시뮬레이터'}
            {activeTab === 'settings' && '설정'}
          </h2>
        </header>

        {activeTab === 'home' && (
          <HomeView
            onSearch={(searchTerm) => {
              const p = Object.values(PLAYERS_DB).find(
                (player) => player.name.includes(searchTerm)
              );
              if (p) {
                setSelectedPlayer(p);
                setActiveTab('analytics');
              } else {
                alert(`'${searchTerm}' 선수를 찾을 수 없습니다. (지원: 김도영, 김하성, 이대호, 이승엽, 최정, 박용택, 나지완)`);
              }
            }}
            standings={standings}
            schedule={schedule}
            isLoading={isLoading}
            onRefresh={fetchDailyData}
          />
        )}
        {activeTab === 'analytics' && <PlayerAnalyticsView playerData={selectedPlayer || PLAYERS_DB['김도영']} />}
        {activeTab === 'simulator' && <SalarySimulatorView />}
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
