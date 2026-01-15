
import React, { useState } from 'react';
import { CSSRSData } from '../types';

interface Props {
  data: CSSRSData;
  onChange: (val: CSSRSData) => void;
  onReset: () => void;
}

const RiskScreening: React.FC<Props> = ({ data, onChange, onReset }) => {
  const [showReferralGuideline, setShowReferralGuideline] = useState(false);
  const toggle = (field: keyof CSSRSData, val: boolean) => onChange({ ...data, [field]: val });

  const isAnyIdeation = data.q1 === true || data.q2 === true;
  const isHighRisk = data.q4 === true || data.q5 === true || data.q6 === true;

  return (
    <section>
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-2 h-6 ${isHighRisk ? 'bg-rose-500' : 'bg-brand-600'} rounded-full`}></div>
            <h2 className="serif text-3xl text-slate-900">安全风险筛查 / C-SSRS</h2>
          </div>
          <p className="text-slate-400 text-sm">哥伦比亚自杀严重程度评定量表 - 临床通用筛查版</p>
        </div>
        
        {isHighRisk && (
          <div className="bg-rose-50 border border-rose-100 px-6 py-2 rounded-2xl flex items-center animate-bounce">
            <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
            <span className="text-rose-600 text-xs font-black uppercase tracking-tighter">已触发：红色干预预警</span>
          </div>
        )}
      </header>

      <div className="space-y-8">
        <div className={`p-8 rounded-3xl border transition-all ${isHighRisk ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
          <h3 className="serif text-xl mb-8 flex items-center">
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black mr-3 shadow-sm">A</span>
            自杀意念评估 (Suicidal Ideation)
          </h3>
          
          <div className="space-y-6">
            <QuestionItem 
              label="1. 死的愿望 (Wish to be Dead)" 
              desc="是否曾希望自己睡着了就不要醒来，或者希望自己已经死掉？"
              val={data.q1}
              onToggle={(v) => toggle('q1', v)}
            />
            <QuestionItem 
              label="2. 非特异性主动念头" 
              desc="是否真的有过结束自己生命的念头？"
              val={data.q2}
              onToggle={(v) => toggle('q2', v)}
            />

            {(isAnyIdeation) && (
              <div className="mt-10 pt-10 border-t border-slate-200/50 space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mb-4">进阶风险维度调查 (Level 3-5)</p>
                <QuestionItem label="3. 方法探究" desc="是否想过具体会怎么做（方法）？但并非真的想去死。" val={data.q3} onToggle={(v) => toggle('q3', v)} />
                <QuestionItem label="4. 意图确认" desc="是否有过自杀念头，且甚至想真的去死？" val={data.q4} onToggle={(v) => toggle('q4', v)} isAlert={true} />
                <QuestionItem label="5. 具体计划" desc="是否已想好细节（何时、何地、如何做）且打算实施？" val={data.q5} onToggle={(v) => toggle('q5', v)} isAlert={true} />
              </div>
            )}
          </div>
        </div>

        <div className={`p-8 rounded-3xl border transition-all ${data.q6 === true ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
          <h3 className="serif text-xl mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black mr-3 shadow-sm">B</span>
            自杀行为评估 (Suicidal Behavior)
          </h3>
          <QuestionItem 
            label="6. 自杀行为" 
            desc="是否做过任何尝试伤害自己以达到结束生命目的的事情？(含准备工作，如买药、写遗书)"
            val={data.q6}
            onToggle={(v) => toggle('q6', v)}
            isAlert={true}
          />
        </div>

        {/* 红色预警触发后的立即操作选项 */}
        {isHighRisk && (
          <div className="mt-12 p-10 bg-rose-600 rounded-4xl text-white shadow-2xl shadow-rose-200 animate-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="serif text-2xl mb-2">已触发危机干预协议</h3>
                <p className="text-rose-100 text-sm leading-relaxed opacity-90">来访者存在极高安全风险。临床伦理要求必须立即停止常规测量，转入危机处置流程。</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <button 
                  onClick={() => setShowReferralGuideline(!showReferralGuideline)}
                  className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center shadow-lg"
                >
                  {showReferralGuideline ? '隐藏指南' : '立即转介'}
                </button>
                <button 
                  onClick={onReset}
                  className="px-8 py-4 bg-rose-800 text-white rounded-2xl font-bold hover:bg-rose-900 transition-all shadow-lg"
                >
                  结束流程
                </button>
              </div>
            </div>

            {showReferralGuideline && (
              <div className="mt-8 pt-8 border-t border-rose-500/50 space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-rose-700/50 p-4 rounded-2xl">
                    <p className="text-xs font-black text-rose-300 uppercase mb-2">第一步：家属通知</p>
                    <p className="text-xs">立即联系紧急联系人，要求家属到场，严禁来访者独自离开。</p>
                  </div>
                  <div className="bg-rose-700/50 p-4 rounded-2xl">
                    <p className="text-xs font-black text-rose-300 uppercase mb-2">第二步：物理安全</p>
                    <p className="text-xs">确保来访者视线不离开工作人员，移除其携带的危险品。</p>
                  </div>
                  <div className="bg-rose-700/50 p-4 rounded-2xl">
                    <p className="text-xs font-black text-rose-300 uppercase mb-2">第三步：医疗转介</p>
                    <p className="text-xs">护送至精神专科医院急诊。若家属拒不配合，必要时拨打110/120。</p>
                  </div>
                  <div className="bg-rose-700/50 p-4 rounded-2xl">
                    <p className="text-xs font-black text-rose-300 uppercase mb-2">第四步：文书留档</p>
                    <p className="text-xs">导出此报告，并完成《安全知情同意书》及《干预记录单》签署。</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const QuestionItem: React.FC<{ label: string; desc: string; val: boolean | null; onToggle: (v: boolean) => void; isAlert?: boolean }> = ({ label, desc, val, onToggle, isAlert }) => (
  <div className={`flex justify-between items-center group transition-opacity`}>
    <div className="max-w-xl">
      <h4 className={`font-bold text-sm mb-1 ${val === true && isAlert ? 'text-rose-600' : 'text-slate-800'}`}>{label}</h4>
      <p className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">{desc}</p>
    </div>
    <div className="flex bg-warm-200/50 p-1 rounded-xl shrink-0 ml-4">
      <button 
        onClick={() => onToggle(true)}
        className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${val === true ? (isAlert ? 'bg-rose-500 text-white shadow-lg' : 'bg-brand-600 text-white shadow-lg') : 'text-slate-400 hover:text-slate-600'}`}
      >是</button>
      <button 
        onClick={() => onToggle(false)}
        className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${val === false ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
      >否</button>
    </div>
  </div>
);

export default RiskScreening;
