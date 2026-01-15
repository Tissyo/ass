
import React from 'react';
import { PatientInfo, Gender, InfoSource } from '../types';

interface Props {
  data: PatientInfo;
  onChange: (val: PatientInfo) => void;
}

const PatientInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof PatientInfo, value: any) => onChange({ ...data, [field]: value });

  return (
    <section>
      <header className="mb-12">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-2 h-6 bg-brand-600 rounded-full"></div>
          <h2 className="serif text-3xl text-slate-900">基本信息 / Patient Information</h2>
        </div>
        <p className="text-slate-400 text-sm">请详细记录评估对象的基础档案，这是形成临床画像的第一步。</p>
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
    </section>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

export default PatientInfoForm;
