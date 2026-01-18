
import React, { useMemo } from 'react';
import { AssessmentState } from '../types.ts';
import RadarChart from './RadarChart.tsx';

interface Props {
  data: AssessmentState;
  onChange: (val: any) => void;
}

const SummarySection: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: string, value: string) => onChange({ ...data.summary, [field]: value });

  // 计算多维度标准化得分 (0-100) 用于雷达图
  const radarData = useMemo(() => {
    const isAdult = data.patient.age >= 18;

    // 1. 家庭系统 (基于 FAD-12, 满分48, 反向题计分由于简化暂按平均值处理)
    const fadScores = Object.values(data.family.fad) as number[];
    const fadScore = fadScores.reduce((a, b) => a + (Number(b) || 0), 0);
    const familyDim = Math.min(100, (fadScore / 48) * 100) || 50;

    // 2. 环境支持 (基于学生学校氛围, 满分124)
    const schoolScores = Object.values(data.school.studentClimate) as number[];
    const schoolScore = schoolScores.reduce((a, b) => a + (Number(b) || 0), 0);
    const schoolDim = Math.min(100, (schoolScore / 124) * 100) || 50;

    // 3. 内在复原力
    let internalRes = 0;
    if (isAdult) {
      const cdriscScores = Object.values(data.resilience.adult.cdrisc) as number[];
      internalRes = cdriscScores.reduce((a, b) => a + (Number(b) || 0), 0);
      internalRes = (internalRes / 40) * 100;
    } else {
      const childScores = Object.values(data.resilience.child.scores) as number[];
      internalRes = childScores.reduce((a, b) => a + (Number(b) || 0), 0);
      internalRes = (internalRes / 16) * 100;
    }
    const internalDim = Math.min(100, internalRes) || 50;

    // 4. 社交支持 (基于 MSPSS, 满分84)
    const mspssScores = Object.values(data.resilience.adult.mspss) as number[];
    const mspssScore = mspssScores.reduce((a, b) => a + (Number(b) || 0), 0);
    const externalDim = Math.min(100, (mspssScore / 84) * 100) || 50;

    // 5. 情绪稳定 (100 - 创伤症状百分比)
    const traumaScore = isAdult ? data.pcl5.totalScore : data.ucla.totalScore;
    const maxTrauma = isAdult ? 80 : 28; 
    const stabilityDim = Math.max(0, 100 - (traumaScore / maxTrauma) * 100) || 80;

    return [
      { label: '家庭动力', value: familyDim },
      { label: '环境支持', value: schoolDim },
      { label: '内在韧性', value: internalDim },
      { label: '社交资源', value: externalDim },
      { label: '情绪稳定', value: stabilityDim },
    ];
  }, [data]);

  const isRisk = data.cssrs.q4 || data.cssrs.q5 || data.cssrs.q6;

  return (
    <section className="space-y-12">
      <header className="text-center mb-16">
        <h2 className="serif text-4xl text-slate-900 mb-4 tracking-tight">临床评估报告全文</h2>
        <div className="flex justify-center space-x-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>ID: {data.patient.id}</span>
          <span>DATE: {data.patient.date}</span>
          <span>CLINICIAN: {data.patient.clinician}</span>
        </div>
      </header>

      {/* 可视化核心区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-warm-50/50 p-10 rounded-[40px] border border-warm-100">
        <div className="flex justify-center no-print">
          <RadarChart data={radarData} size={400} />
        </div>
        
        <div className="space-y-6">
           <h3 className="serif text-2xl text-slate-800">多维系统评估画像</h3>
           <div className="grid grid-cols-2 gap-4">
              <MetricItem label="安全状态" status={isRisk ? 'danger' : 'safe'} />
              <MetricItem label="家庭功能度" value={`${radarData[0].value.toFixed(0)}%`} />
              <MetricItem label="环境支持度" value={`${radarData[1].value.toFixed(0)}%`} />
              <MetricItem label="核心稳定性" value={`${radarData[4].value.toFixed(0)}%`} />
           </div>
           <p className="text-xs text-slate-400 leading-relaxed italic mt-4">
             * 注：雷达图展示了案主心理社会系统五个维度的平衡状态。高分代表该领域具备较强的保护性因子或资源，低分则提示需要重点关注的临床干预方向。
           </p>
        </div>
      </div>

      {/* AI 画像核心分析 */}
      <div className="space-y-4 pt-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-1.5 h-4 bg-brand-600 rounded-full"></div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">临床画像分析 (Clinical Formulation)</label>
        </div>
        <textarea 
          value={data.summary.clinicalFormulation}
          onChange={(e) => handleChange('clinicalFormulation', e.target.value)}
          className="w-full h-[600px] border-2 border-warm-100 focus:border-brand-200 rounded-[40px] p-10 text-slate-700 leading-relaxed outline-none transition-all shadow-inner serif text-base"
          placeholder="此处将展示 AI 生成或手动填写的临床画像，整合症状表现、家庭动力及环境支持系统的深度分析..."
        />
      </div>

      {/* 结构化访谈内容摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] p-10 bg-slate-50 rounded-[40px] border border-slate-100 text-slate-600 leading-relaxed">
        <div className="space-y-4">
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">家谱图访谈关键点：</p>
          <div className="space-y-2">
            <div><span className="font-bold">当前状况:</span> {data.family.genogramCurrent || '无记录'}</div>
            <div><span className="font-bold">广泛背景:</span> {data.family.genogramBackground || '无记录'}</div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">依恋与性格形成：</p>
          <div>
            <p className="font-bold text-slate-800 mb-1">早年依恋状态:</p>
            <p className="mb-4">{data.family.attachment.parent || '未记录'}</p>
            <p className="font-bold text-slate-800 mb-1">代际传递影响:</p>
            <p>{data.family.attachment.child || '未记录'}</p>
          </div>
        </div>
      </div>

      <footer className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-48 h-px bg-slate-200"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">评估师签名: {data.patient.clinician}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-200 uppercase tracking-[0.4em] mb-1">Confidential Clinical Record</p>
          <p className="text-[10px] text-slate-300">© 2025 见己 · 深度评估系统</p>
        </div>
      </footer>
    </section>
  );
};

const MetricItem = ({ label, value, status }: { label: string; value?: string; status?: 'danger' | 'safe' }) => (
  <div className="bg-white p-4 rounded-2xl border border-warm-200 flex flex-col justify-center shadow-sm">
    <span className="text-[10px] font-black text-slate-300 uppercase mb-1 tracking-tight">{label}</span>
    {status ? (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${status === 'danger' ? 'bg-rose-500 animate-pulse' : 'bg-brand-500'}`}></div>
        <span className={`text-sm font-bold ${status === 'danger' ? 'text-rose-600' : 'text-brand-700'}`}>{status === 'danger' ? '预警' : '安全'}</span>
      </div>
    ) : (
      <span className="text-lg font-black text-slate-700">{value}</span>
    )}
  </div>
);

export default SummarySection;
