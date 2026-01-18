
import React from 'react';
import { PatientInfo, Gender, InfoSource } from '../types';

interface Props {
  data: PatientInfo;
  enabledModules: string[];
  onModulesChange: (modules: string[]) => void;
  onChange: (val: PatientInfo) => void;
}

const PatientInfoForm: React.FC<Props> = ({ data, enabledModules, onModulesChange, onChange }) => {
  const handleChange = (field: keyof PatientInfo, value: any) => onChange({ ...data, [field]: value });

  const toggleModule = (moduleId: string) => {
    if (enabledModules.includes(moduleId)) {
      onModulesChange(enabledModules.filter(m => m !== moduleId));
    } else {
      onModulesChange([...enabledModules, moduleId]);
    }
  };

  const toggleConcern = (concern: string) => {
    const current = data.concerns || [];
    if (current.includes(concern)) {
      handleChange('concerns', current.filter(c => c !== concern));
    } else {
      handleChange('concerns', [...current, concern]);
    }
  };

  const modules = [
    { id: 'risk', label: 'C-SSRS 安全风险筛查', desc: '自杀意念与行为的标准化评估', color: 'bg-rose-500' },
    { id: 'family', label: '家庭动力系统评估', desc: '家谱图访谈、依恋传递及家庭功能', color: 'bg-indigo-500' },
    { id: 'school', label: '环境支持/学校氛围', desc: '评估同伴关系与学校支持系统', color: 'bg-teal-500' },
    { id: 'trauma', label: '创伤暴露与症状 (PCL-5/UCLA)', desc: '识别重大生活事件及PTSD核心症状', color: 'bg-purple-500' },
    { id: 'resilience', label: '心理弹性与资源画像', desc: '评估内在复原力与外部社会支持', color: 'bg-brand-500' },
  ];

  const concernOptions = [
    { id: 'school_refusal', label: '拒学 / 学业压力' },
    { id: 'sep_anxiety', label: '分离焦虑' },
    { id: 'parent_anxiety', label: '养育焦虑' },
    { id: 'mood_low', label: '情绪低落 / 抑郁' },
    { id: 'social_anxiety', label: '社交回避 / 焦虑' },
    { id: 'conduct_issue', label: '行为问题 / 冲动' },
    { id: 'sleep_issue', label: '睡眠困扰' },
    { id: 'trauma_flash', label: '创伤再体验' },
  ];

  return (
    <div className="space-y-16">
      <section>
        <header className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-brand-600 rounded-full"></div>
            <h2 className="serif text-3xl text-slate-900">基本信息 / Patient Information</h2>
          </div>
          <p className="text-slate-400 text-sm">请详细记录评估对象的基础档案。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <Field label="姓名 (Name)">
            <input type="text" value={data.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="来访者姓名" className="input-clean" />
          </Field>

          <Field label="档案编号 (ID)">
            <input type="text" value={data.id} onChange={(e) => handleChange('id', e.target.value)} placeholder="JJ-2025-XXXX" className="input-clean" />
          </Field>

          <Field label="年龄 (Age)">
            <input type="number" value={data.age || ''} onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)} placeholder="0" className="input-clean" />
          </Field>

          <Field label="性别 (Gender)">
            <div className="flex space-x-8 pt-2">
              {(['男', '女', '其他'] as Gender[]).map(g => (
                <label key={g} className="flex items-center space-x-2.5 cursor-pointer group">
                  <input type="radio" name="gender" checked={data.gender === g} onChange={() => handleChange('gender', g)} className="radio-custom" />
                  <span className={`text-sm font-semibold transition-colors ${data.gender === g ? 'text-brand-700' : 'text-slate-400 group-hover:text-slate-600'}`}>{g}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="出生日期 (DOB)">
            <input type="date" value={data.dob} onChange={(e) => handleChange('dob', e.target.value)} className="input-clean" />
          </Field>

          <Field label="评估日期 (Assessment Date)">
            <input type="date" value={data.date} onChange={(e) => handleChange('date', e.target.value)} className="input-clean" />
          </Field>

          <Field label="评估师 (Clinician)">
            <input type="text" value={data.clinician} onChange={(e) => handleChange('clinician', e.target.value)} placeholder="签字心理咨询师" className="input-clean" />
          </Field>

          <Field label="信息来源">
            <div className="flex space-x-8 pt-2">
              {(['本人', '家长', '其他'] as InfoSource[]).map(s => (
                <label key={s} className="flex items-center space-x-2.5 cursor-pointer group">
                  <input type="radio" name="source" checked={data.source === s} onChange={() => handleChange('source', s)} className="radio-custom" />
                  <span className={`text-sm font-semibold transition-colors ${data.source === s ? 'text-brand-700' : 'text-slate-400 group-hover:text-slate-600'}`}>{s}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>
      </section>

      <section>
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
            <h2 className="serif text-2xl text-slate-800">主诉困扰 / Presenting Concerns</h2>
          </div>
          <p className="text-slate-400 text-sm">勾选本次评估的核心临床诉求。</p>
        </header>

        <div className="flex flex-wrap gap-3">
          {concernOptions.map(opt => {
            const isSelected = (data.concerns || []).includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleConcern(opt.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${isSelected ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200'}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 shadow-inner">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-slate-400 rounded-full"></div>
            <h2 className="serif text-2xl text-slate-800">临床评估方案 / Assessment Plan</h2>
          </div>
          <p className="text-slate-400 text-sm">勾选本次评估需要涵盖的临床维度，系统将自动生成对应的工作流。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(m => {
            const isActive = enabledModules.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModule(m.id)}
                className={`flex items-start p-6 rounded-3xl border-2 transition-all text-left group ${isActive ? 'bg-white border-brand-500 shadow-lg shadow-brand-100' : 'bg-white/50 border-slate-100 grayscale hover:grayscale-0 hover:border-slate-300'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center text-white mr-4 shrink-0 transition-transform group-hover:scale-110`}>
                  {isActive ? '✓' : ''}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{m.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <style>{`
        .input-clean {
          width: 100%;
          border-bottom: 2px solid #F1F5F9;
          background: transparent;
          padding: 8px 0;
          font-size: 15px;
          font-weight: 600;
          color: #1E293B;
          transition: all 0.3s;
          outline: none;
        }
        .input-clean:focus {
          border-bottom-color: #0d9488;
        }
        .input-clean::placeholder { color: #CBD5E1; font-weight: 400; }
        
        .radio-custom {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #E2E8F0;
          border-radius: 50%;
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
        }
        .radio-custom:checked {
          border-color: #0d9488;
          background-color: #0d9488;
          box-shadow: inset 0 0 0 3px white;
        }
      `}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

export default PatientInfoForm;
