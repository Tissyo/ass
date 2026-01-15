
import React, { useState, useEffect } from 'react';
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
  
  // 核心风险判定
  const isHighRisk = data.q4 === true || data.q5 === true || data.q6 === true;
  const isAnyIdeation = data.q1 === true || data.q2 === true;

  // 联动清除逻辑：如果 Q1 和 Q2 都不是“是”，则必须清空 Q3, Q4, Q5 的状态
  const toggle = (field: keyof CSSRSData, val: boolean) => {
    let newData = { ...data, [field]: val };
    
    // 如果修改的是 Q1 或 Q2，且两者现在都不为 true
    if ((field === 'q1' || field === 'q2')) {
      const willHaveIdeation = field === 'q1' ? val || data.q2 : data.q1 || val;
      if (!willHaveIdeation) {
        // 自动重置进阶问题，防止隐藏后预警依然存在
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
      {/* 顶部动态背景：根据风险等级变换颜色 */}
      <div className={`p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden transition-all duration-1000 ${isHighRisk ? 'bg-gradient-to-br from-rose-500 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl shadow-inner">
            {isHighRisk ? '⛈️' : '🛡️'}
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-2">{isHighRisk ? '需要大人抱抱 (Needs Help)' : '心灵守护计划 (Guardian Sky)'}</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {isHighRisk ? '现在的天空有点小风暴，别担心，我们会和大人一起保护你。' : '每个人心里都有晴天和雨天，告诉我们你天空里的秘密。'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Q1, Q2 始终显示 */}
        {childQuestions.slice(0, 2).map((q) => (
          <ChildQuestionCard 
            key={q.key}
            q={q}
            val={data[q.key as keyof CSSRSData] as boolean | null}
            onToggle={(v) => toggle(q.key as keyof CSSRSData, v)}
          />
        ))}

        {/* 只有当 Q1 或 Q2 为真时，才展开 Q3-Q5 */}
        {isAnyIdeation && (
          <div className="space-y-6 mt-12 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-3 px-4">
              <div className="w-1.5 h-4 bg-amber-400 rounded-full"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">进阶守护观察 (Level 3-5)</p>
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

        {/* Q6 独立展示，因为它不依赖意念 */}
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
      <div className={`p-8 rounded-3xl border transition-all duration-500 ${isHighRisk ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
        <h3 className="serif text-xl mb-8 flex items-center">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black mr-3 shadow-sm">A</span>
          自杀意念评估 (Suicidal Ideation)
        </h3>
        
        <div className="space-y-6">
          <QuestionItem label="1. 死的愿望" desc="是否曾希望自己睡着了就不要醒来，或者希望自己已经死掉？" val={data.q1} onToggle={(v) => toggle('q1', v)} />
          <QuestionItem label="2. 非特异性主动念头" desc="是否真的有过结束自己生命的念头？" val={data.q2} onToggle={(v) => toggle('q2', v)} />

          {isAnyIdeation && (
            <div className="mt-10 pt-10 border-t border-slate-200/50 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
              <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mb-4">进阶风险维度调查 (Level 3-5)</p>
              <QuestionItem label="3. 方法探究" desc="是否想过具体会怎么做（方法）？但并非真的想去死。" val={data.q3} onToggle={(v) => toggle('q3', v)} />
              <QuestionItem label="4. 意图确认" desc="是否有过自杀念头，且甚至想真的去死？" val={data.q4} onToggle={(v) => toggle('q4', v)} isAlert={true} />
              <QuestionItem label="5. 具体计划" desc="是否已想好细节（何时、何地、如何做）且打算实施？" val={data.q5} onToggle={(v) => toggle('q5', v)} isAlert={true} />
            </div>
          )}
        </div>
      </div>

      <div className={`p-8 rounded-3xl border transition-all duration-500 ${data.q6 === true ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
        <h3 className="serif text-xl mb-6 flex items-center">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black mr-3 shadow-sm">B</span>
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
          <p className="text-slate-400 text-sm">哥伦比亚自杀严重程度评定量表 - 临床通用版</p>
        </div>
        
        {/* 动态显示的红色干预预警：仅在命中高风险选项时出现 */}
        {isHighRisk && (
          <div className="bg-rose-50 border border-rose-100 px-6 py-2 rounded-2xl flex items-center animate-in zoom-in duration-300">
            <div className="w-2 h-2 bg-rose-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-rose-600 text-xs font-black uppercase tracking-tighter">已触发：红色干预预警</span>
          </div>
        )}
      </header>

      {isChild ? renderChildView() : renderAdultView()}

      {/* 底部危机干预面板：同样是动态出现/消失 */}
      {isHighRisk && (
        <div className="mt-12 p-10 bg-slate-900 rounded-[40px] text-white shadow-2xl animate-in slide-in-from-bottom-6 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="serif text-2xl mb-2 text-rose-400">已触发危机干预协议 (RED ALERT)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">来访者存在极高安全风险。根据临床伦理，必须优先处理安全危机。后续常规测量已自动锁定。</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <button 
                onClick={() => setShowReferralGuideline(!showReferralGuideline)}
                className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center shadow-lg"
              >
                {showReferralGuideline ? '隐藏指南' : '立即启动转介'}
              </button>
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
  <div className={`p-8 rounded-[35px] border-2 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm hover:shadow-md ${val === true ? (isAlert ? 'bg-rose-50 border-rose-300' : 'bg-indigo-50 border-indigo-200') : 'bg-white border-slate-100'}`}>
    <div className="flex items-center space-x-6 w-full">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-colors duration-300 ${val === true ? (isAlert ? 'bg-rose-100' : 'bg-indigo-100') : 'bg-slate-50'}`}>{q.icon}</div>
      <div className="flex-1">
        <h4 className={`font-black text-sm mb-1 uppercase tracking-widest ${val === true && isAlert ? 'text-rose-600' : 'text-slate-400'}`}>{q.label}</h4>
        <p className={`text-lg font-bold leading-relaxed transition-colors duration-300 ${val === true && isAlert ? 'text-rose-800' : 'text-slate-800'}`}>{q.desc}</p>
      </div>
    </div>
    <div className="flex space-x-3 w-full md:w-auto">
      <button 
        onClick={() => onToggle(true)}
        className={`flex-1 md:px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-sm ${val === true ? (isAlert ? 'bg-rose-600 text-white shadow-rose-200 shadow-lg' : 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg') : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
      >是，有过</button>
      <button 
        onClick={() => onToggle(false)}
        className={`flex-1 md:px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-sm ${val === false ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
      >没有过</button>
    </div>
  </div>
);

const QuestionItem: React.FC<{ label: string; desc: string; val: boolean | null; onToggle: (v: boolean) => void; isAlert?: boolean }> = ({ label, desc, val, onToggle, isAlert }) => (
  <div className={`flex justify-between items-center group transition-opacity`}>
    <div className="max-w-xl">
      <h4 className={`font-bold text-sm mb-1 transition-colors ${val === true && isAlert ? 'text-rose-600' : 'text-slate-800'}`}>{label}</h4>
      <p className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">{desc}</p>
    </div>
    <div className="flex bg-warm-200/50 p-1 rounded-xl shrink-0 ml-4">
      <button onClick={() => onToggle(true)} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${val === true ? (isAlert ? 'bg-rose-500 text-white shadow-lg' : 'bg-brand-600 text-white shadow-lg') : 'text-slate-400 hover:text-slate-600'}`}>是</button>
      <button onClick={() => onToggle(false)} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${val === false ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>否</button>
    </div>
  </div>
);

const ReferralInfo = () => (
  <div className="mt-8 pt-8 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ReferralStep step="01" title="家属通知" desc="立即联系监护人要求其到场，在专业人员接手前严禁来访者独自离开。" />
      <ReferralStep step="02" title="物理安全" desc="确保来访者视线不离开工作人员，移除其随身携带的危险品。" />
      <ReferralStep step="03" title="医疗转介" desc="建议转介至最近的精神专科急诊。若家属不配合且风险极高，必要时报警。" />
      <ReferralStep step="04" title="文书留档" desc="导出本评估档案作为书面依据，并完成后续危机干预记录单的签署。" />
    </div>
  </div>
);

const ReferralStep = ({ step, title, desc }: any) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
    <p className="text-[9px] font-black text-rose-500 uppercase mb-1 tracking-widest">Step {step}</p>
    <p className="text-sm font-bold mb-1 text-white/90">{title}</p>
    <p className="text-[11px] text-slate-400 leading-tight">{desc}</p>
  </div>
);

export default RiskScreening;
