
import React, { useState } from 'react';
import { CSSRSData } from '../types';

interface Props {
  age: number;
  data: CSSRSData;
  onChange: (val: CSSRSData) => void;
  onReset: () => void;
}

const RiskScreening: React.FC<Props> = ({ age, data, onChange, onReset }) => {
  const [showReferralGuideline, setShowReferralGuideline] = useState(false);
  const isChild = age > 0 && age < 13;
  
  // 核心风险判定：实时计算
  const isHighRisk = data.q4 === true || data.q5 === true || data.q6 === true;
  const isAnyIdeation = data.q1 === true || data.q2 === true;

  // 状态联动更新函数
  const toggle = (field: keyof CSSRSData, val: boolean) => {
    let newData = { ...data, [field]: val };
    
    // 关键逻辑：如果 Q1 和 Q2 都为否/空，必须联动重置 Q3-Q5
    if ((field === 'q1' || field === 'q2')) {
      const currentIdeation = field === 'q1' ? val : data.q1;
      const otherIdeation = field === 'q2' ? val : data.q2;
      if (!currentIdeation && !otherIdeation) {
        newData.q3 = null;
        newData.q4 = null;
        newData.q5 = null;
      }
    }
    onChange(newData);
  };

  const childQuestions = [
    { key: 'q1', label: '1. 累累的念头', desc: '心里的小精灵有没有累到想永远睡着，不想醒来？或者希望自己从来没来过这里？', icon: '😴' },
    { key: 'q2', label: '2. 离开的念头', desc: '脑袋里有没有偶尔冒出过想让自己消失，或者离开这个世界的念头？', icon: '☁️' },
    { key: 'q3', label: '3. 找寻方法', desc: '有没有想过如果真的要离开，会用什么魔法或办法呢？（只是想过）', icon: '🔍' },
    { key: 'q4', label: '4. 真的很想', desc: '这种念头是不是变得很强烈，让你觉得真的想离开大家？', icon: '⚡' },
    { key: 'q5', label: '5. 制定计划', desc: '有没有已经想好具体的计划了？比如在什么时候、什么地方、怎么做？', icon: '📅' },
    { key: 'q6', label: '6. 危险动作', desc: '有没有真的试过做一些让自己受伤、或者想离开这里的危险动作？', icon: '🚨' }
  ];

  const renderChildView = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className={`p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden transition-all duration-700 ${isHighRisk ? 'bg-gradient-to-br from-rose-500 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
            {isHighRisk ? '⛈️' : '🛡️'}
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">{isHighRisk ? '心灵守护·风暴预警' : '心灵守护计划 (Guardian Sky)'}</h3>
            <p className="text-white/80 text-sm opacity-90 leading-relaxed max-w-lg">
              {isHighRisk ? '天空正面临一场小风暴，别担心，我们会和大人一起保护你，直到天晴。' : '每个人心里都有晴天和雨天，告诉我们你天空里的秘密，我们会一直陪着你。'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {childQuestions.slice(0, 2).map((q) => (
          <ChildQuestionCard 
            key={q.key}
            q={q}
            val={data[q.key as keyof CSSRSData] as boolean | null}
            onToggle={(v) => toggle(q.key as keyof CSSRSData, v)}
          />
        ))}

        {isAnyIdeation && (
          <div className="space-y-6 mt-12 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-3 px-4 mb-4">
              <div className="w-1.5 h-4 bg-amber-400 rounded-full"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">进阶守护对话</p>
            </div>
            {childQuestions.slice(2, 5).map((q) => (
              <ChildQuestionCard 
                key={q.key}
                q={q}
                val={data[q.key as keyof CSSRSData] as boolean | null}
                onToggle={(v) => toggle(q.key as keyof CSSRSData, v)}
                isAlert={q.key === 'q4' || q.key === 'q5'}
              />
            ))}
          </div>
        )}

        <div className="mt-12">
          <ChildQuestionCard 
            q={childQuestions[5]}
            val={data.q6}
            onToggle={(v) => toggle('q6', v)}
            isAlert={true}
          />
        </div>
      </div>
    </div>
  );

  const renderAdultView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`p-8 rounded-3xl border transition-all duration-500 ${isHighRisk ? 'bg-rose-50/40 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
        <h3 className="serif text-xl mb-8 flex items-center">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black mr-3 shadow-sm text-slate-400">A</span>
          自杀意念评估 (Suicidal Ideation)
        </h3>
        <div className="space-y-6">
          <QuestionItem label="1. 死的愿望" desc="是否曾希望自己睡着了就不要醒来，或者希望自己已经死掉？" val={data.q1} onToggle={(v) => toggle('q1', v)} />
          <QuestionItem label="2. 非特异性主动念头" desc="是否真的有过结束自己生命的念头？" val={data.q2} onToggle={(v) => toggle('q2', v)} />
          {isAnyIdeation && (
            <div className="mt-10 pt-10 border-t border-slate-200/50 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
              <QuestionItem label="3. 方法探究" desc="是否想过具体会怎么做（方法）？但并非真的想去死。" val={data.q3} onToggle={(v) => toggle('q3', v)} />
              <QuestionItem label="4. 意图确认" desc="是否有过自杀念头，且甚至想真的去死？" val={data.q4} onToggle={(v) => toggle('q4', v)} isAlert={true} />
              <QuestionItem label="5. 具体计划" desc="是否已想好细节（何时、何地、如何做）且打算实施？" val={data.q5} onToggle={(v) => toggle('q5', v)} isAlert={true} />
            </div>
          )}
        </div>
      </div>
      <div className={`p-8 rounded-3xl border transition-all duration-500 ${data.q6 === true ? 'bg-rose-50 border-rose-200 shadow-lg' : 'bg-slate-50 border-slate-100'}`}>
        <h3 className="serif text-xl mb-6 flex items-center">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black mr-3 shadow-sm text-slate-400">B</span>
          自杀行为评估 (Suicidal Behavior)
        </h3>
        <QuestionItem label="6. 自杀行为" desc="是否做过任何尝试伤害自己以达到结束生命目的的事情？" val={data.q6} onToggle={(v) => toggle('q6', v)} isAlert={true} />
      </div>
    </div>
  );

  return (
    <section>
      <header className="mb-12 flex justify-between items-end no-print">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-2 h-6 transition-colors duration-500 ${isHighRisk ? 'bg-rose-500' : 'bg-brand-600'} rounded-full`}></div>
            <h2 className="serif text-3xl text-slate-900">{isChild ? '守护对话 / C-SSRS' : '安全风险筛查 / C-SSRS'}</h2>
          </div>
          <p className="text-slate-400 text-sm font-medium">哥伦比亚自杀严重程度评定量表 (儿童/通用临床版)</p>
        </div>
        
        {/* 动态出现的红色警报气泡 */}
        {isHighRisk && (
          <div className="bg-rose-600 text-white px-6 py-2 rounded-2xl flex items-center animate-in zoom-in duration-300 shadow-xl shadow-rose-200">
            <div className="w-2 h-2 bg-white rounded-full mr-3 animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">红 色 干 预 预 警</span>
          </div>
        )}
      </header>

      {isChild ? renderChildView() : renderAdultView()}

      {/* 动态出现的危机处置面板 */}
      {isHighRisk && (
        <div className="mt-12 p-10 bg-slate-900 rounded-[40px] text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-500 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1">
              <h3 className="serif text-2xl mb-2 text-rose-400">危机预警生效中 (Crisis Protocol)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">系统已检测到高风险行为或意图。请参考以下步骤进行即时干预，或通过顶部按钮导出“危机转介单”。</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <button onClick={() => setShowReferralGuideline(!showReferralGuideline)} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg">{showReferralGuideline ? '收起指南' : '干预指南'}</button>
              <button onClick={onReset} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all">重置评估</button>
            </div>
          </div>
          {showReferralGuideline && <ReferralInfo />}
        </div>
      )}
    </section>
  );
};

const ChildQuestionCard: React.FC<{ q: any; val: boolean | null; onToggle: (v: boolean) => void; isAlert?: boolean }> = ({ q, val, onToggle, isAlert }) => (
  <div className={`p-8 rounded-[40px] border-2 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm hover:shadow-md ${val === true ? (isAlert ? 'bg-rose-50 border-rose-300 ring-4 ring-rose-50' : 'bg-indigo-50 border-indigo-200') : 'bg-white border-slate-100'}`}>
    <div className="flex items-center space-x-6 w-full">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-sm transition-all duration-500 ${val === true ? (isAlert ? 'bg-rose-200' : 'bg-indigo-200 scale-110') : 'bg-slate-50'}`}>{q.icon}</div>
      <div className="flex-1">
        <h4 className={`font-black text-[10px] mb-2 uppercase tracking-widest ${val === true && isAlert ? 'text-rose-500' : 'text-slate-300'}`}>{q.label}</h4>
        <p className={`text-xl font-bold leading-tight transition-colors duration-500 ${val === true && isAlert ? 'text-rose-900' : 'text-slate-800'}`}>{q.desc}</p>
      </div>
    </div>
    <div className="flex space-x-3 w-full md:w-auto">
      <button onClick={() => onToggle(true)} className={`flex-1 md:px-12 py-4 rounded-2xl font-black text-sm transition-all ${val === true ? (isAlert ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200') : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>是有过</button>
      <button onClick={() => onToggle(false)} className={`flex-1 md:px-12 py-4 rounded-2xl font-black text-sm transition-all ${val === false ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>没有过</button>
    </div>
  </div>
);

const QuestionItem: React.FC<{ label: string; desc: string; val: boolean | null; onToggle: (v: boolean) => void; isAlert?: boolean }> = ({ label, desc, val, onToggle, isAlert }) => (
  <div className={`flex justify-between items-center group`}>
    <div className="max-w-xl">
      <h4 className={`font-bold text-sm mb-1 transition-colors ${val === true && isAlert ? 'text-rose-600' : 'text-slate-800'}`}>{label}</h4>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
    <div className="flex bg-warm-200/50 p-1 rounded-xl shrink-0 ml-4">
      <button onClick={() => onToggle(true)} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${val === true ? (isAlert ? 'bg-rose-500 text-white' : 'bg-brand-600 text-white') : 'text-slate-400 hover:text-slate-600'}`}>是</button>
      <button onClick={() => onToggle(false)} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${val === false ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>否</button>
    </div>
  </div>
);

const ReferralInfo = () => (
  <div className="mt-8 pt-8 border-t border-white/10 space-y-4 animate-in fade-in duration-300">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
        <p className="text-[9px] font-black text-rose-500 uppercase mb-2 tracking-widest">立即行动</p>
        <p className="text-sm font-bold mb-1 text-white">家属在场与物理隔离</p>
        <p className="text-xs text-slate-400 leading-relaxed">严禁来访者独自离开，移除视线范围内所有利器、尖锐物品及药品。</p>
      </div>
      <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
        <p className="text-[9px] font-black text-rose-500 uppercase mb-2 tracking-widest">医疗转介</p>
        <p className="text-sm font-bold mb-1 text-white">精神科急诊导向</p>
        <p className="text-xs text-slate-400 leading-relaxed">告知家属风险的紧迫性，建议立即前往具备精神科急诊能力的综合医院。</p>
      </div>
    </div>
  </div>
);

export default RiskScreening;
