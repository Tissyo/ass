
import React, { useState, useMemo, useEffect } from 'react';
import { AssessmentState } from './types.ts';
import PatientInfoForm from './components/PatientInfoForm.tsx';
import RiskScreening from './components/RiskScreening.tsx';
import TraumaAssessment from './components/TraumaAssessment.tsx';
import ResilienceAssessment from './components/ResilienceAssessment.tsx';
import SummarySection from './components/SummarySection.tsx';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'jianji_assessment_data';

const initialState: AssessmentState = {
  patient: { name: '', gender: '男', age: 0, dob: '', date: new Date().toISOString().split('T')[0], id: '', clinician: '', source: '本人' },
  cssrs: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, intensityScore: 0, intensityDescription: '', frequency: '' },
  ucla: { history: { naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false }, scores: {}, totalScore: 0 },
  pcl5: { history: { naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false }, indexTrauma: '', indexTraumaDate: '', scores: {}, totalScore: 0 },
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
  const [showReferralInfo, setShowReferralInfo] = useState(false);

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

  const isHighRisk = useMemo(() => data.cssrs.q4 === true || data.cssrs.q5 === true || data.cssrs.q6 === true, [data.cssrs]);
  const isAdult = data.patient.age >= 18;

  const tabs = [
    { id: 'basic', label: '基本信息', icon: 'ri:user-3-line', step: '01' },
    { id: 'risk', label: '安全风险', icon: 'ri:shield-cross-line', step: '02' },
    { id: 'trauma', label: '创伤评估', icon: 'ri:brain-line', step: '03', disabled: isHighRisk },
    { id: 'resilience', label: '复原力', icon: 'ri:seedling-line', step: '04', disabled: isHighRisk },
    { id: 'summary', label: '评估报告', icon: 'ri:file-list-3-line', step: '05', disabled: isHighRisk }
  ];

  const resetData = () => {
    if (window.confirm("确定要启动新的临床评估吗？当前数据将被清空。")) {
      setData(initialState);
      localStorage.removeItem(STORAGE_KEY);
      setActiveTab('basic');
      setShowReferralInfo(false);
    }
  };

  const generateAIFormulation = async () => {
    if (!process.env.API_KEY) {
      alert("请配置 API_KEY。");
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位临床心理专家。基于：[基本信息] ${JSON.stringify(data.patient)}，[风险] C-SSRS: ${JSON.stringify(data.cssrs)}，[总分] ${isAdult ? data.pcl5.totalScore : data.ucla.totalScore}。请写一份包含核心症状、风险等级、资源画像的专业临床画像，中文输出。`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      if (response.text) setData(prev => ({ ...prev, summary: { ...prev.summary, clinicalFormulation: response.text } }));
    } catch (e) { alert("生成失败"); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部进度条 */}
      <div className={`h-1 transition-all duration-700 no-print ${isHighRisk ? 'bg-rose-500' : 'bg-brand-600'}`} style={{ width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}></div>

      <header className="bg-warm-50/80 backdrop-blur-md border-b border-warm-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${isHighRisk ? 'bg-rose-600' : 'bg-brand-700'} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-brand-700/20 transition-all`}>
              见
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">见己 · 深度评估</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Clinical Assessment Record</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={resetData} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all" title="重置档案">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button onClick={() => window.print()} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">导出档案</button>
            {!isHighRisk && (
              <button onClick={generateAIFormulation} className="px-6 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-700/30 hover:bg-brand-800 transition-all">
                ✨ AI 画像生成
              </button>
            )}
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-6 flex justify-between">
          <ul className="flex space-x-1">
            {tabs.map((tab, idx) => (
              <li key={tab.id} className="relative">
                <button
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`group relative px-6 py-4 flex flex-col items-center transition-all ${
                    activeTab === tab.id ? 'text-brand-700' : (tab.disabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600')
                  }`}
                >
                  <span className={`text-[10px] font-black mb-1 transition-all ${activeTab === tab.id ? 'text-brand-500' : 'text-slate-300'}`}>{tab.step}</span>
                  <span className="text-sm font-bold tracking-wide">{tab.label}</span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-brand-600 rounded-full animate-in fade-in zoom-in duration-300"></div>}
                </button>
              </li>
            ))}
          </ul>
          <div className="py-4 text-[11px] font-bold text-slate-300 flex items-center uppercase tracking-widest">
            {activeTab === 'summary' ? 'Finalization' : 'Assessment Process'}
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className={`main-card bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-4xl border ${isHighRisk ? 'border-rose-100' : 'border-warm-200'} p-10 md:p-16 transition-all duration-500`}>
          
          {isHighRisk && activeTab !== 'basic' && activeTab !== 'risk' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 className="serif text-4xl text-rose-600 mb-6">发现高风险：立即介入</h2>
              <p className="text-slate-500 max-w-xl mb-12 text-lg leading-relaxed">
                根据 C-SSRS 筛查结果，来访者正处于极高风险状态。临床伦理要求我们优先处理生命安全。
              </p>
              <div className="flex space-x-4 w-full max-w-md">
                <button onClick={() => setShowReferralInfo(true)} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all">立即转介</button>
                <button onClick={resetData} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">结束档案</button>
              </div>
              {showReferralInfo && (
                <div className="mt-12 p-10 bg-rose-50/50 rounded-3xl border border-rose-100 text-left w-full max-w-2xl animate-in fade-in zoom-in duration-500">
                  <h3 className="serif text-xl text-rose-800 mb-4">转介与干预建议</h3>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start"><span className="w-2 h-2 mt-2 bg-rose-400 rounded-full mr-3 shrink-0"></span>医疗建议：立即由监护人送至最近的精神专科医院急诊。</li>
                    <li className="flex items-start"><span className="w-2 h-2 mt-2 bg-rose-400 rounded-full mr-3 shrink-0"></span>物理环境：告知监护人移除家中所有潜在危险物品。</li>
                    <li className="flex items-start"><span className="w-2 h-2 mt-2 bg-rose-400 rounded-full mr-3 shrink-0"></span>协议签署：必须签署《安全知情同意书》及应急响应计划。</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {activeTab === 'basic' && <PatientInfoForm data={data.patient} onChange={(val) => setData(prev => ({ ...prev, patient: val }))} />}
              {activeTab === 'risk' && <RiskScreening data={data.cssrs} onChange={(val) => setData(prev => ({ ...prev, cssrs: val }))} />}
              {activeTab === 'trauma' && <TraumaAssessment isAdult={isAdult} ucla={data.ucla} pcl5={data.pcl5} onUCLAChange={(val) => setData(prev => ({ ...prev, ucla: val }))} onPCL5Change={(val) => setData(prev => ({ ...prev, pcl5: val }))} />}
              {activeTab === 'resilience' && <ResilienceAssessment age={data.patient.age} data={data.resilience} onChange={(val) => setData(prev => ({ ...prev, resilience: val }))} />}
              {activeTab === 'summary' && <SummarySection data={data} onChange={(val) => setData(prev => ({ ...prev, summary: val }))} />}
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-slate-300 no-print">
          <div className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="w-12 h-px bg-warm-200"></span>
            <span>Jianji Clinical Assessment Pro</span>
            <span className="w-12 h-px bg-warm-200"></span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
