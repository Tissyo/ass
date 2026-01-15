
import React, { useMemo } from 'react';
import { AssessmentState } from '../types.ts';
import RadarChart from './RadarChart.tsx';

interface Props {
  data: AssessmentState;
  onChange: (val: any) => void;
}

const SummarySection: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: string, value: string) => onChange({ ...data.summary, [field]: value });
  const { age } = data.patient;
  const isChild = age > 0 && age < 13;

  const radarData = useMemo(() => {
    const res = data.resilience;
    let p = 0, f = 0, s = 0;

    const getScore = (map: any, ids: string[], max: number, min: number = 0) => {
      let sum = 0;
      ids.forEach(id => sum += (map[id] || min));
      return ((sum - (ids.length * min)) / (ids.length * (max - min))) * 100;
    };

    if (age > 0 && age < 13) {
      p = getScore(res.child.scores, ['1', '2', '3'], 2);
      f = getScore(res.child.scores, ['4', '5'], 2);
      s = getScore(res.child.scores, ['6', '7', '8'], 2);
    } else if (age >= 13 && age < 18) {
      p = getScore(res.teen.scores, ['1', '2', '3', '4'], 5, 1);
      f = getScore(res.teen.scores, ['5', '6', '7', '8'], 5, 1);
      s = getScore(res.teen.scores, ['9', '10', '11', '12'], 5, 1);
    } else if (age >= 18) {
      const cdScore = Object.values(res.adult.cdrisc).reduce<number>((acc, cur) => acc + (Number(cur) || 0), 0);
      p = (cdScore / 40) * 100;
      f = getScore(res.adult.mspss, ['3', '4', '8', '11'], 7, 1);
      s = getScore(res.adult.mspss, ['1', '2', '6', '7', '9', '10', '12'], 7, 1);
    }

    return [
      { label: isChild ? '我的小超能力' : '个体韧性', value: Math.max(5, p || 0), icon: '⭐', color: 'text-amber-400' },
      { label: isChild ? '温暖的避风港' : '家庭支持', value: Math.max(5, f || 0), icon: '🏠', color: 'text-rose-400' },
      { label: isChild ? '我的秘密基地' : '社会环境', value: Math.max(5, s || 0), icon: '🌈', color: 'text-indigo-400' }
    ];
  }, [data.resilience, data.patient.age]);

  return (
    <section>
      <header className="mb-16 text-center">
        <h2 className="serif text-4xl text-slate-900 mb-4">{isChild ? '成长能量探索报告' : '临床评估结论报告'}</h2>
        <div className="flex justify-center items-center space-x-6">
          <Badge label="ID" value={data.patient.id || '未编号'} />
          <Badge label="Date" value={data.patient.date} />
          <Badge label="Clinician" value={data.patient.clinician || '未署名'} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* 左侧：可视化 */}
        <div className="lg:col-span-5">
          <div className={`${isChild ? 'bg-gradient-to-br from-yellow-50 via-white to-blue-50 border-white shadow-xl' : 'bg-warm-50 border-warm-200'} rounded-4xl p-10 border flex flex-col items-center transition-all`}>
            <h3 className={`serif text-lg mb-10 ${isChild ? 'text-amber-700' : 'text-brand-800'}`}>
              {isChild ? '你的能量成长乐园 🎡' : '复原力与资源画像'}
            </h3>
            
            {isChild ? (
              <div className="w-full space-y-12">
                {radarData.map(d => (
                  <div key={d.label} className="relative">
                    <div className="flex justify-between items-end mb-3">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{d.icon}</span>
                        <div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d.label === '我的小超能力' ? 'Personal' : d.label === '温暖的避风港' ? 'Family' : 'World'}</p>
                          <p className={`font-bold text-sm ${d.color}`}>{d.label}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-700">{Math.round(d.value)}<span className="text-xs ml-0.5 opacity-50">%</span></p>
                    </div>
                    <div className="h-4 w-full bg-white/60 rounded-full overflow-hidden border border-white shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${
                          d.label === '我的小超能力' ? 'bg-gradient-to-r from-amber-300 to-yellow-400' :
                          d.label === '温暖的避风港' ? 'bg-gradient-to-r from-rose-300 to-pink-400' :
                          'bg-gradient-to-r from-indigo-300 to-blue-400'
                        }`}
                        style={{ width: `${d.value}%` }}
                      >
                        <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <RadarChart data={radarData} size={280} />
                <div className="mt-12 grid grid-cols-3 gap-8 w-full">
                  {radarData.map(d => (
                    <div key={d.label} className="text-center">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">{d.label}</p>
                      <p className="text-2xl font-black text-brand-700">{Math.round(d.value)}<span className="text-xs ml-0.5">%</span></p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-xs text-slate-400 leading-relaxed">
            {isChild ? '* 这是一个为你准备的“能量包”，它记录了你在成长中积累的勇气、爱和支持。' : '* 数字化画像基于 CD-RISC、MSPSS 及 CYRM 等量表数据转化，用于辅助评估资源储备。'}
          </div>
        </div>

        {/* 右侧：文案输出 */}
        <div className="lg:col-span-7 space-y-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-1.5 h-4 ${isChild ? 'bg-amber-400' : 'bg-brand-600'} rounded-full`}></div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{isChild ? '成长探险记录 (Clinical Formulation)' : '临床画像分析 (Formulation)'}</label>
            </div>
            <textarea 
              value={data.summary.clinicalFormulation}
              onChange={(e) => handleChange('clinicalFormulation', e.target.value)}
              className={`w-full h-[480px] border-2 ${isChild ? 'border-amber-100 focus:border-amber-300' : 'border-warm-100 focus:border-brand-200'} rounded-3xl p-8 text-slate-700 leading-loose outline-none transition-colors shadow-inner text-sm serif`}
              placeholder={isChild ? "在这里记录下孩子闪闪发光的时刻，以及我们如何一起面对挑战..." : "请通过 AI 生成或手动录入临床综合分析，包含核心症状描述、风险程度判断及复原资源分析..."}
            />
          </div>
        </div>
      </div>
      
      {/* 签名区域 */}
      <div className="mt-24 pt-12 border-t border-warm-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* 来访者/监护人 */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Client / Guardian Signature</p>
            <div className="h-10 border-b border-slate-200"></div>
            <p className="text-xs text-slate-500 font-bold">来访者/监护人签名</p>
            <p className="text-[9px] text-slate-300">日期：____ 年 ____ 月 ____ 日</p>
          </div>

          {/* 主评估师 */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Lead Clinician Signature</p>
            <div className="h-10 border-b border-slate-200"></div>
            <p className="text-xs text-slate-500 font-bold">主评估师：{data.patient.clinician || '________'}</p>
            <p className="text-[9px] text-slate-300">日期：{data.patient.date}</p>
          </div>

          {/* 督导 */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Supervisor Signature</p>
            <div className="h-10 border-b border-slate-200"></div>
            <p className="text-xs text-slate-500 font-bold">临床督导签字</p>
            <p className="text-[9px] text-slate-300">日期：____ 年 ____ 月 ____ 日</p>
          </div>
        </div>
        
        <div className="mt-16 flex justify-between items-end text-[9px] font-bold text-slate-200 uppercase tracking-[0.3em]">
          <span>Jianji clinical protocol v2.5.0</span>
          <span>Confidential medical record</span>
        </div>
      </div>
    </section>
  );
};

const Badge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center space-x-2">
    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{label}:</span>
    <span className="text-xs font-bold text-slate-600">{value}</span>
  </div>
);

export default SummarySection;
