
import React, { useState } from 'react';
import { UCLAPTSDData, PCL5Data, TraumaHistory, ChildAdventureData } from '../types';

interface Props {
  isAdult: boolean;
  ucla: UCLAPTSDData;
  pcl5: PCL5Data;
  onUCLAChange: (val: UCLAPTSDData) => void;
  onPCL5Change: (val: PCL5Data) => void;
  onSkipToResilience: () => void;
}

const TraumaAssessment: React.FC<Props> = ({ isAdult, ucla, pcl5, onUCLAChange, onPCL5Change, onSkipToResilience }) => {
  const [step, setStep] = useState(0); 
  const [customWishInput, setCustomWishInput] = useState('');
  const isChild = !isAdult;

  const initialAdventure: ChildAdventureData = ucla.adventure || {
    mood: '',
    moodReason: '',
    bodyMarkers: [],
    familyPositions: [
      { id: 'me', x: 300, y: 300, scale: 1.2, name: '我' },
      { id: 'dad', x: 150, y: 150, scale: 1, name: '爸爸' },
      { id: 'mom', x: 450, y: 150, scale: 1, name: '妈妈' },
    ],
    wishes: []
  };

  const updateAdventure = (patch: Partial<ChildAdventureData>) => {
    onUCLAChange({
      ...ucla,
      adventure: { ...initialAdventure, ...patch }
    });
  };

  // --- 页面 1: 心情气象站 ---
  const renderWeatherStation = () => {
    const moods = [
      { id: 'sun', label: '开心的太阳', icon: '☀️', color: 'bg-amber-100 border-amber-400 text-amber-600' },
      { id: 'cloud', label: '发呆的云朵', icon: '☁️', color: 'bg-slate-100 border-slate-300 text-slate-500' },
      { id: 'lightning', label: '生气的闪电', icon: '⚡', color: 'bg-yellow-50 border-yellow-500 text-yellow-700' },
      { id: 'rain', label: '想哭的雨滴', icon: '🌧️', color: 'bg-blue-50 border-blue-400 text-blue-600' },
      { id: 'tornado', label: '害怕的龙卷风', icon: '🌪️', color: 'bg-purple-50 border-purple-400 text-purple-600' }
    ];

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-4">
          <h3 className="serif text-3xl text-slate-800">第一站：心情气象站 🌤️</h3>
          <p className="text-slate-500">嘿！现在的你，心里住着什么样的天气呢？</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {moods.map(m => (
            <button
              key={m.id}
              onClick={() => updateAdventure({ mood: m.id })}
              className={`flex flex-col items-center p-6 rounded-4xl border-4 transition-all transform hover:scale-105 active:scale-95 ${initialAdventure.mood === m.id ? m.color + ' shadow-xl' : 'bg-white border-transparent text-slate-400'}`}
            >
              <span className="text-5xl mb-4">{m.icon}</span>
              <span className="font-black text-sm">{m.label}</span>
            </button>
          ))}
        </div>
        {initialAdventure.mood && (
          <div className="bg-white p-8 rounded-4xl border-2 border-dashed border-slate-200 animate-in zoom-in duration-300">
            <p className="text-center font-bold text-slate-700 mb-6">心里出现这个天气，是因为...</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['学校里的事', '爸爸妈妈吵架', '被老师批评', '朋友不理我', '自己做的梦', '没原因，就是这样'].map(reason => (
                <button
                  key={reason}
                  onClick={() => updateAdventure({ moodReason: reason })}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${initialAdventure.moodReason === reason ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 页面 2: 身体地图 ---
  const renderBodyMap = () => {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-4">
          <h3 className="serif text-3xl text-slate-800">第二站：身体小地图 🧸</h3>
          <p className="text-slate-500">如果身体有哪里不舒服、痛痛，或者有人乱碰过，请帮它贴上“创可贴”。</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
          <div className="relative bg-white p-10 rounded-[60px] shadow-2xl shadow-slate-100 border-4 border-slate-50">
            <svg width="240" height="400" viewBox="0 0 240 400" className="cursor-crosshair" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              updateAdventure({ bodyMarkers: [...initialAdventure.bodyMarkers, { x, y, type: 'bandaid' }] });
            }}>
              <path d="M120 20 C140 20, 155 35, 155 55 C155 75, 140 90, 120 90 C100 90, 85 75, 85 55 C85 35, 100 20, 120 20 M155 90 L180 130 C190 145, 185 160, 170 160 L150 150 L150 240 L170 360 C175 380, 155 390, 140 380 L120 350 L100 380 C85 390, 65 380, 70 360 L90 240 L90 150 L70 160 C55 160, 50 145, 60 130 L85 90 Z" fill="#FDF2F0" stroke="#E2E8F0" strokeWidth="4" />
              {initialAdventure.bodyMarkers.map((m, i) => (
                <g key={i} transform={`translate(${m.x}, ${m.y})`}>
                  <rect x="-15" y="-6" width="30" height="12" rx="4" fill="#F43F5E" opacity="0.8" transform="rotate(45)" />
                  <rect x="-15" y="-6" width="30" height="12" rx="4" fill="#F43F5E" opacity="0.8" transform="rotate(-45)" />
                </g>
              ))}
            </svg>
          </div>
          <button onClick={() => updateAdventure({ bodyMarkers: [] })} className="px-8 py-3 rounded-2xl border-2 border-rose-100 text-rose-500 font-bold hover:bg-rose-50">重新贴贴</button>
        </div>
      </div>
    );
  };

  // --- 页面 3: 家庭星系 (带同心圆) ---
  const renderFamilyGalaxy = () => {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-4">
          <h3 className="serif text-3xl text-slate-800">第三站：我的家庭星球 🌌</h3>
          <p className="text-slate-500">离你近的人放近一点，你觉得他力量很大（很重要）就把他变大。</p>
        </div>
        <div className="relative w-full aspect-square max-w-2xl mx-auto bg-[#0a0f1d] rounded-[60px] overflow-hidden shadow-2xl border-8 border-slate-800">
          {/* 同心圆背景 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] aspect-square border-2 border-white/5 rounded-full"></div>
            <div className="w-[55%] aspect-square border-2 border-white/10 rounded-full absolute"></div>
            <div className="w-[30%] aspect-square border-2 border-white/15 rounded-full absolute"></div>
          </div>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          {initialAdventure.familyPositions.map((p, i) => (
            <div 
              key={p.id}
              style={{ left: p.x, top: p.y, transform: `translate(-50%, -50%) scale(${p.scale})` }}
              className={`absolute cursor-move transition-shadow ${p.id === 'me' ? 'z-20' : 'z-10'}`}
              onMouseDown={(e) => {
                const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
                const onMove = (me: MouseEvent) => {
                  const newX = Math.max(50, Math.min(rect.width - 50, me.clientX - rect.left));
                  const newY = Math.max(50, Math.min(rect.height - 50, me.clientY - rect.top));
                  const n = [...initialAdventure.familyPositions];
                  n[i] = { ...p, x: newX, y: newY };
                  updateAdventure({ familyPositions: n });
                };
                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl ${p.id === 'me' ? 'bg-gradient-to-br from-blue-400 to-indigo-600 ring-4 ring-white/40' : 'bg-slate-700/80 backdrop-blur-md border border-white/20'}`}>
                <span className="text-3xl mb-1">{p.id === 'me' ? '🧒' : p.id === 'dad' ? '👨' : '👩'}</span>
                <span className="text-[10px] uppercase tracking-tighter">{p.name}</span>
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex space-x-1 opacity-60 hover:opacity-100 transition-opacity">
                 <button onClick={(e) => { e.stopPropagation(); const n = [...initialAdventure.familyPositions]; n[i].scale = Math.min(2.5, n[i].scale + 0.1); updateAdventure({ familyPositions: n }) }} className="w-6 h-6 bg-white/20 rounded-full text-white text-xs">+</button>
                 <button onClick={(e) => { e.stopPropagation(); const n = [...initialAdventure.familyPositions]; n[i].scale = Math.max(0.5, n[i].scale - 0.1); updateAdventure({ familyPositions: n }) }} className="w-6 h-6 bg-white/20 rounded-full text-white text-xs">-</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 页面 4: 魔法愿望 (带自定义编辑) ---
  const renderMagicWishes = () => {
    const fixedWishes = [
      { text: '爸爸妈妈不吵架', icon: '🕊️' },
      { text: '有很多好朋友', icon: '👫' },
      { text: '变聪明/学习好', icon: '🎓' },
      { text: '想要更多抱抱', icon: '🫂' },
      { text: '变勇敢，不害怕', icon: '🛡️' }
    ];

    const addWish = (txt: string) => {
      if (initialAdventure.wishes.length < 3 && !initialAdventure.wishes.includes(txt)) {
        updateAdventure({ wishes: [...initialAdventure.wishes, txt] });
      }
    };

    const removeWish = (txt: string) => {
      updateAdventure({ wishes: initialAdventure.wishes.filter(t => t !== txt) });
    };

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-4">
          <h3 className="serif text-3xl text-slate-800">第四站：魔法神灯 🧞‍♂️</h3>
          <p className="text-slate-500">选出 3 个你最想要的魔法心愿贴纸，也可以自己写哦！</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {fixedWishes.map(w => {
            const isSelected = initialAdventure.wishes.includes(w.text);
            return (
              <button
                key={w.text}
                onClick={() => isSelected ? removeWish(w.text) : addWish(w.text)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center transform hover:scale-105 ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-600'}`}
              >
                <span className="text-4xl mb-3">{w.icon}</span>
                <span className="text-xs font-black">{w.text}</span>
              </button>
            );
          })}
          
          {/* 自定义贴纸槽位 */}
          <div className="col-span-2 md:col-span-3 bg-white p-6 rounded-3xl border-2 border-dashed border-indigo-200 flex items-center space-x-4">
            <input 
              type="text" 
              value={customWishInput} 
              onChange={(e) => setCustomWishInput(e.target.value)}
              placeholder="在这里输入你的悄悄话..."
              className="flex-1 bg-transparent border-b border-indigo-100 text-indigo-700 outline-none p-2 font-bold"
            />
            <button 
              onClick={() => { if(customWishInput) { addWish(customWishInput); setCustomWishInput(''); } }}
              className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-black text-sm hover:bg-indigo-600"
            >
              变出来！
            </button>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {[0, 1, 2].map(i => {
            const txt = initialAdventure.wishes[i];
            return (
              <div key={i} className={`w-32 h-32 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center p-4 text-center ${txt ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-lg rotate-2' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                {txt ? (
                  <>
                    <span className="text-xs font-black mb-1">愿望 #{i+1}</span>
                    <span className="text-[10px] leading-tight font-bold">{txt}</span>
                    <button onClick={() => removeWish(txt)} className="mt-2 text-[10px] text-rose-400 font-bold">× 撤销</button>
                  </>
                ) : <span className="text-2xl">✨</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 页面 5: 小秘密打分 (重构为卡片互动模式) ---
  const renderChildScoring = () => {
    const childQuestions = [
      { id: 1, text: '当我不想去想那件可怕的事情时，它还是会突然冒出来。', grp: '记忆' },
      { id: 2, text: '我会做关于那件事的噩梦。', grp: '梦境' },
      { id: 6, text: '我尽量不去想、不谈论那件可怕的事情。', grp: '回避' },
      { id: 9, text: '我觉得自己很糟糕，或者觉得这个世界很危险。', grp: '心情' },
      { id: 14, text: '我很容易发脾气，或者容易跟人吵架。', grp: '脾气' },
      { id: 17, text: '我很容易被突然的声音或动作吓一跳。', grp: '身体' },
      { id: 19, text: '我很难入睡，或者半夜容易醒来。', grp: '睡眠' }
    ];

    const scoreOptions = [
      { val: 0, label: '完全没有', icon: '😊' },
      { val: 1, label: '有一点点', icon: '😐' },
      { val: 2, label: '经常这样', icon: '😟' },
      { val: 3, label: '很多很多', icon: '😢' },
      { val: 4, label: '总是如此', icon: '😫' }
    ];

    const handleScore = (id: number, val: number) => {
      const s = { ...ucla.scores, [id]: val };
      // Fix: Cast Object.values to number[] to resolve 'unknown' type assignment error
      const total = (Object.values(s) as number[]).reduce((a: number, b: number) => a + b, 0);
      onUCLAChange({ ...ucla, scores: s, totalScore: total });
    };

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
        <div className="text-center space-y-4">
          <h3 className="serif text-3xl text-slate-800">终点站：小秘密打分 📝</h3>
          <p className="text-slate-500">帮我们了解一下，这些不舒服的感觉发生的次数多吗？</p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          {childQuestions.map(q => (
            <div key={q.id} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-[10px] font-black bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full uppercase tracking-widest">{q.grp}</span>
              </div>
              <p className="text-lg font-bold text-slate-800 mb-8 leading-relaxed">“{q.text}”</p>
              
              <div className="flex justify-between items-center gap-2">
                {scoreOptions.map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => handleScore(q.id, opt.val)}
                    className={`flex-1 flex flex-col items-center py-4 rounded-2xl border-2 transition-all transform active:scale-90 ${ucla.scores[q.id] === opt.val ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                  >
                    <span className="text-2xl mb-2">{opt.icon}</span>
                    <span className="text-[10px] font-black">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHistoryStep = () => {
    const historyFields: { key: keyof TraumaHistory; label: string }[] = [
      { key: 'naturalDisaster', label: '自然灾害 (地震、水灾、火灾等)' },
      { key: 'accident', label: '意外事故 (严重车祸、受伤等)' },
      { key: 'witnessViolence', label: '目睹暴力 (家里或社区里的冲突)' },
      { key: 'physicalAbuse', label: '身体受伤 (被重重地责打)' },
      { key: 'sexualTrauma', label: '性创伤 (被强迫不舒服的接触)' },
      { key: 'loss', label: '亲人丧失 (非常亲近的人离开了)' },
      { key: 'medicalTrauma', label: '医疗创伤 (痛苦的手术或重病)' }
    ];

    const activeHistory = isAdult ? pcl5.history : ucla.history;
    const handleToggle = (key: keyof TraumaHistory) => {
      const h = { ...activeHistory, [key]: !activeHistory[key], none: false };
      if (isAdult) onPCL5Change({ ...pcl5, history: h });
      else onUCLAChange({ ...ucla, history: h });
    };

    return (
      <div className="animate-in fade-in duration-500">
        <h3 className="font-bold text-slate-700 mb-8 flex items-center">
           <span className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs mr-3">A</span>
           创伤历史概况 (Trauma History)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          <label className={`flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${activeHistory.none ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100'}`}>
            <input type="checkbox" checked={activeHistory.none} onChange={handleNone} className="hidden" />
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center mr-4">{activeHistory.none && <div className="w-2 h-2 bg-white rounded-full"></div>}</span>
            <span className="text-sm font-bold">没有经历过上述任何情况 (跳过创伤评估)</span>
          </label>
          {historyFields.map(f => (
            <label key={f.key} className={`flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${activeHistory[f.key] ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md' : 'bg-white border-slate-100 hover:border-brand-200'}`}>
              <input type="checkbox" checked={activeHistory[f.key]} onChange={() => handleToggle(f.key)} className="hidden" />
              <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center mr-4">{activeHistory[f.key] && <div className="w-2 h-2 bg-brand-600 rounded-full"></div>}</span>
              <span className="text-sm font-bold">{f.label}</span>
            </label>
          ))}
        </div>
        {!activeHistory.none && isChild && (
          <div className="flex justify-center mt-12">
            <button onClick={() => setStep(1)} className="group relative px-16 py-6 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              开始奇妙探险评估模式 ✨
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-xl animate-bounce">🎒</div>
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleNone = () => {
    const h: TraumaHistory = { none: true, naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false };
    if (isAdult) onPCL5Change({ ...pcl5, history: h, scores: {}, totalScore: 0 });
    else onUCLAChange({ ...ucla, history: h, scores: {}, totalScore: 0 });
    onSkipToResilience();
  };

  const renderAdultForm = () => {
    const qlist = [
      { id: 1, text: '反复出现关于该压力事件的、令人不安的记忆、想法或画面？', grp: '侵入' },
      { id: 2, text: '反复做关于该压力事件的令人不安的梦？', grp: '侵入' },
      { id: 6, text: '回避关于该压力事件的记忆、想法或感觉？', grp: '回避' },
      { id: 9, text: '对自己、他人或世界持有强烈的负面信念？', grp: '认知' },
      { id: 11, text: '持续拥有负面的情绪状态（如恐惧、愤怒、内疚、羞耻）？', grp: '情绪' },
      { id: 15, text: '易怒、爆发愤怒或表现出攻击性行为？', grp: '警觉' },
      { id: 20, text: '难以入睡或易醒？', grp: '生理' }
    ];
    const handleS = (id: number, val: number) => {
      const s = { ...pcl5.scores, [id]: val };
      // Fix: Cast Object.values to number[] to resolve 'unknown' type assignment error
      const totalScore = (Object.values(s) as number[]).reduce((a: number, b: number) => a + b, 0);
      onPCL5Change({ ...pcl5, scores: s, totalScore });
    };
    return (
      <div className="space-y-6">
        {qlist.map(q => (
          <div key={q.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{q.grp}</span>
              <div className="flex space-x-1">
                {[0,1,2,3,4].map(v => (
                  <button key={v} onClick={() => handleS(q.id, v)} className={`w-10 h-10 rounded-xl font-bold transition-all ${pcl5.scores[q.id] === v ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{v}</button>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-700 font-semibold">{q.text}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section>
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-8 ${isChild ? 'bg-indigo-600' : 'bg-purple-600'} rounded-full`}></div>
          <h2 className="serif text-4xl text-slate-900">
            {isChild ? '奇妙探险：找回你的能量' : '创伤评估 (PCL-5)'}
          </h2>
        </div>
        <div className={`px-8 py-3 rounded-2xl font-black text-lg ${isChild ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
          评估得分: {isAdult ? pcl5.totalScore : ucla.totalScore}
        </div>
      </div>

      {step === 0 ? renderHistoryStep() : (
        <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 border border-indigo-100 rounded-[50px] p-10 md:p-16 shadow-2xl relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex space-x-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'bg-indigo-600 w-16' : (step > i ? 'bg-indigo-200 w-8' : 'bg-slate-100 w-8')}`}></div>
            ))}
          </div>

          <div className="mt-12 min-h-[500px]">
            {step === 1 && renderWeatherStation()}
            {step === 2 && renderBodyMap()}
            {step === 3 && renderFamilyGalaxy()}
            {step === 4 && renderMagicWishes()}
            {step === 5 && renderChildScoring()}
          </div>

          <div className="mt-16 flex justify-between">
            <button 
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="px-10 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 transition-all"
            >
              返回上一站
            </button>
            <button 
              onClick={() => step < 5 ? setStep(s => s + 1) : onSkipToResilience()}
              className="px-16 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
            >
              {step < 5 ? '去下一站探险' : '完成探险之旅'}
            </button>
          </div>
        </div>
      )}

      {isAdult && !pcl5.history.none && (
        <div className="mt-12 bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm animate-in fade-in duration-500">
           <h3 className="serif text-2xl text-slate-800 mb-10 flex items-center">
             <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs mr-3">B</span>
             症状严重程度评估 (PCL-5)
           </h3>
           {renderAdultForm()}
        </div>
      )}
    </section>
  );
};

export default TraumaAssessment;
