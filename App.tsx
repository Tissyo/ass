
import React, { useState, useMemo, useEffect } from 'react';
import { AssessmentState } from './types.ts';
import PatientInfoForm from './components/PatientInfoForm.tsx';
import RiskScreening from './components/RiskScreening.tsx';
import FamilyAssessment from './components/FamilyAssessment.tsx';
import SchoolAssessment from './components/SchoolAssessment.tsx';
import TraumaAssessment from './components/TraumaAssessment.tsx';
import ResilienceAssessment from './components/ResilienceAssessment.tsx';
import SummarySection from './components/SummarySection.tsx';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'jianji_assessment_data_v3';

const initialHistory = { none: false, naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false };

const initialState: AssessmentState = {
  config: {
    enabledModules: ['risk', 'family', 'school', 'trauma', 'resilience']
  },
  patient: { 
    name: '', 
    gender: '男', 
    age: 0, 
    dob: '', 
    date: new Date().toISOString().split('T')[0], 
    id: '', 
    clinician: '', 
    source: '本人',
    concerns: [] 
  },
  cssrs: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, intensityScore: 0, intensityDescription: '', frequency: '' },
  family: {
    genogram: '',
    genogramCurrent: '',
    genogramBackground: '',
    genogramBrief: '',
    attachment: { child: '', parent: '' },
    ffas: {},
    fad: {},
    psi: {},
    ppfq: {},
    apq: {}
  },
  school: {
    studentClimate: {},
    parentClimate: {}
  },
  ucla: { history: { ...initialHistory }, scores: {}, totalScore: 0 },
  pcl5: { history: { ...initialHistory }, indexTrauma: '', indexTraumaDate: '', scores: {}, totalScore: 0 },
  resilience: {
    child: { scores: {} },
    teen: { scores: {} },
    adult: { cdrisc: {}, mspss: {} }
  },
  summary: { clinicalFormulation: '', needs: '', actionPlan: '' }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [data, setData] = useState<AssessmentState>(initialState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setData(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, isDataLoaded]);

  const isHighRisk = useMemo(() => {
    return data.cssrs.q4 === true || data.cssrs.q5 === true || data.cssrs.q6 === true;
  }, [data.cssrs]);

  const isAdult = data.patient.age >= 18;

  const allTabs = [
    { id: 'basic', label: '基本信息', step: '01' },
    { id: 'risk', label: '安全风险', step: '02' },
    { id: 'family', label: '家庭系统', step: '03' },
    { id: 'school', label: '学校系统', step: '04' },
    { id: 'trauma', label: '创伤评估', step: '05', disabled: isHighRisk },
    { id: 'resilience', label: '复原力指数', step: '06', disabled: isHighRisk },
    { id: 'summary', label: '评估报告', step: '07' }
  ];

  const visibleTabs = useMemo(() => {
    return allTabs.filter(tab => 
      tab.id === 'basic' || 
      tab.id === 'summary' || 
      data.config.enabledModules.includes(tab.id)
    ).map((tab, index) => ({
      ...tab,
      displayStep: (index + 1).toString().padStart(2, '0')
    }));
  }, [data.config.enabledModules, isHighRisk]);

  const resetData = () => {
    if (window.confirm("确定要启动新的临床评估吗？当前评估数据将被彻底清空。")) {
      setData(initialState);
      localStorage.removeItem(STORAGE_KEY);
      setActiveTab('basic');
    }
  };

  const generateAIFormulation = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位临床心理专家。请基于以下多维度数据生成临床画像：
      [基本] ${JSON.stringify(data.patient)}
      [风险] ${JSON.stringify(data.cssrs)}
      [家庭功能] FFAS/FAD数据: ${JSON.stringify(data.family.ffas)} ${JSON.stringify(data.family.fad)}
      [养育] PSI/APQ数据: ${JSON.stringify(data.family.psi)} ${JSON.stringify(data.family.apq)}
      [学校氛围] ${JSON.stringify(data.school)}
      [症状] 分数: ${isAdult ? data.pcl5.totalScore : data.ucla.totalScore}。
      
      要求：输出纯中文散文段落，严禁使用 # * - 等符号或列表格式。包含核心症状、家庭动力分析、环境支持及风险评估。`;

      const response = await ai.models.generateContent({ 
        model: 'gemini-3-pro-preview', 
        contents: prompt 
      });
      
      if (response.text) {
        const cleanText = response.text.replace(/[#*\->]/g, '').replace(/\n\s*\n/g, '\n\n').trim();
        setData(prev => ({ ...prev, summary: { ...prev.summary, clinicalFormulation: cleanText } }));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className={`h-1 transition-all duration-700 no-print ${isHighRisk ? 'bg-rose-500 animate-pulse' : 'bg-brand-600'}`} style={{ width: `${((visibleTabs.findIndex(t => t.id === activeTab) + 1) / visibleTabs.length) * 100}%` }}></div>

      <header className="bg-warm-50/80 backdrop-blur-md border-b border-warm-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${isHighRisk ? 'bg-rose-600' : 'bg-brand-700'} rounded-2xl flex items-center justify-center text-white text-xl font-bold`}>见</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">见己 · 深度评估</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Clinical Assessment Record</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={resetData} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded-full transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
            <button onClick={() => window.print()} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm">导出档案</button>
            {!isHighRisk && <button onClick={generateAIFormulation} className="px-6 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold shadow-lg">✨ AI 画像生成</button>}
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-6 flex overflow-x-auto no-scrollbar">
          <ul className="flex space-x-1">
            {visibleTabs.map((tab) => (
              <li key={tab.id} className="shrink-0">
                <button
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`group relative px-6 py-4 flex flex-col items-center transition-all ${activeTab === tab.id ? (isHighRisk ? 'text-rose-600' : 'text-brand-700') : (tab.disabled ? 'text-slate-200' : 'text-slate-400 hover:text-slate-600')}`}
                >
                  <span className={`text-[10px] font-black mb-1 ${activeTab === tab.id ? (isHighRisk ? 'text-rose-400' : 'text-brand-500') : 'text-slate-300'}`}>{tab.displayStep}</span>
                  <span className="text-sm font-bold">{tab.label}</span>
                  {activeTab === tab.id && <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${isHighRisk ? 'bg-rose-600' : 'bg-brand-600'}`}></div>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className={`main-card bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-4xl border ${isHighRisk ? 'border-rose-200' : 'border-warm-200'} p-10 md:p-16 transition-all duration-500`}>
          {activeTab === 'basic' && (
            <PatientInfoForm 
              data={data.patient} 
              enabledModules={data.config.enabledModules}
              onModulesChange={(modules) => setData(prev => ({ ...prev, config: { ...prev.config, enabledModules: modules } }))}
              onChange={(val) => setData(prev => ({ ...prev, patient: val }))} 
            />
          )}
          {activeTab === 'risk' && <RiskScreening age={data.patient.age} data={data.cssrs} onChange={(val) => setData(prev => ({ ...prev, cssrs: val }))} onReset={resetData} />}
          {activeTab === 'family' && <FamilyAssessment data={data.family} onChange={(val) => setData(prev => ({ ...prev, family: val }))} />}
          {activeTab === 'school' && <SchoolAssessment data={data.school} onChange={(val) => setData(prev => ({ ...prev, school: val }))} />}
          {activeTab === 'trauma' && <TraumaAssessment isAdult={isAdult} ucla={data.ucla} pcl5={data.pcl5} onUCLAChange={(val) => setData(prev => ({ ...prev, ucla: val }))} onPCL5Change={(val) => setData(prev => ({ ...prev, pcl5: val }))} onSkipToResilience={() => setActiveTab('resilience')} />}
          {activeTab === 'resilience' && <ResilienceAssessment age={data.patient.age} data={data.resilience} onChange={(val) => setData(prev => ({ ...prev, resilience: val }))} />}
          {activeTab === 'summary' && <SummarySection data={data} onChange={(val) => setData(prev => ({ ...prev, summary: val }))} />}
        </div>
      </main>
    </div>
  );
};

export default App;
