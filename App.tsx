
import React, { useState, useMemo, useEffect } from 'react';
import { AssessmentState } from './types.ts';
import PatientInfoForm from './components/PatientInfoForm.tsx';
import RiskScreening from './components/RiskScreening.tsx';
import TraumaAssessment from './components/TraumaAssessment.tsx';
import ResilienceAssessment from './components/ResilienceAssessment.tsx';
import SummarySection from './components/SummarySection.tsx';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'jianji_assessment_data';

const initialHistory = { none: false, naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false };

const initialState: AssessmentState = {
  patient: { name: '', gender: '男', age: 0, dob: '', date: new Date().toISOString().split('T')[0], id: '', clinician: '', source: '本人' },
  cssrs: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, intensityScore: 0, intensityDescription: '', frequency: '' },
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

  // 高风险判定逻辑
  const isHighRisk = useMemo(() => {
    return data.cssrs.q4 === true || data.cssrs.q5 === true || data.cssrs.q6 === true;
  }, [data.cssrs]);

  const isAdult = data.patient.age >= 18;

  const tabs = [
    { id: 'basic', label: '基本信息', icon: 'ri:user-3-line', step: '01' },
    { id: 'risk', label: '安全风险', icon: 'ri:shield-cross-line', step: '02' },
    { id: 'trauma', label: '创伤评估', icon: 'ri:brain-line', step: '03', disabled: isHighRisk },
    { id: 'resilience', label: '复原力', icon: 'ri:seedling-line', step: '04', disabled: isHighRisk },
    { id: 'summary', label: '评估报告', icon: 'ri:file-list-3-line', step: '05' }
  ];

  const resetData = () => {
    if (window.confirm("确定要启动新的临床评估吗？当前评估数据将被彻底清空。")) {
      setData(initialState);
      localStorage.removeItem(STORAGE_KEY);
      setActiveTab('basic');
      setShowReferralInfo(false);
    }
  };

  const generateAIFormulation = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一位临床心理专家。基于：[基本信息] ${JSON.stringify(data.patient)}，[风险] C-SSRS: ${JSON.stringify(data.cssrs)}，[总分] ${isAdult ? data.pcl5.totalScore : data.ucla.totalScore}。请写一份包含核心症状、风险等级、资源画像的专业临床画像，中文输出。`;
      const response = await ai.models.generateContent({ 
        model: 'gemini-3-pro-preview', 
        contents: prompt 
      });
      
      if (response.text) {
        setData(prev => ({ 
          ...prev, 
          summary: { 
            ...prev.summary, 
            clinicalFormulation: response.text 
          } 
        }));
      }
    } catch (e) { 
      console.error("Clinical formulation generation failed:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部进度条 */}
      <div className={`h-1 transition-all duration-700 no-print ${isHighRisk ? 'bg-rose-500 animate-pulse' : 'bg-brand-600'}`} style={{ width: isHighRisk ? '100%' : `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}></div>

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
                    activeTab === tab.id ? (isHighRisk ? 'text-rose-600' : 'text-brand-700') : (tab.disabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600')
                  }`}
                >
                  <span className={`text-[10px] font-black mb-1 transition-all ${activeTab === tab.id ? (isHighRisk ? 'text-rose-400' : 'text-brand-500') : 'text-slate-300'}`}>{tab.step}</span>
                  <span className="text-sm font-bold tracking-wide">{tab.label}</span>
                  {activeTab === tab.id && <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full animate-in fade-in zoom-in duration-300 ${isHighRisk ? 'bg-rose-600' : 'bg-brand-600'}`}></div>}
                </button>
              </li>
            ))}
          </ul>
          <div className="py-4 text-[11px] font-bold text-slate-300 flex items-center uppercase tracking-widest">
            {isHighRisk ? 'Crisis Protocol Active' : (activeTab === 'summary' ? 'Finalization' : 'Assessment Process')}
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className={`main-card bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-4xl border ${isHighRisk ? 'border-rose-200 shadow-rose-100/20' : 'border-warm-200'} p-10 md:p-16 transition-all duration-500`}>
          
          {isHighRisk && (activeTab === 'trauma' || activeTab === 'resilience') ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 className="serif text-4xl text-rose-600 mb-6">发现极高风险：测量已锁定</h2>
              <p className="text-slate-500 max-w-xl mb-12 text-lg leading-relaxed">
                根据 C-SSRS 评估，当前来访者正处于<b>生命危险状态</b>。此时严禁继续进行耗时较长的常规测量。请立即前往“评估报告”选项卡导出危机转介单。
              </p>
              <div className="flex space-x-4 w-full max-w-md">
                <button onClick={() => setActiveTab('summary')} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center">
                  前往评估报告
                </button>
                <button onClick={resetData} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all">结束流程</button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {activeTab === 'basic' && <PatientInfoForm data={data.patient} onChange={(val) => setData(prev => ({ ...prev, patient: val }))} />}
              {activeTab === 'risk' && <RiskScreening age={data.patient.age} data={data.cssrs} onChange={(val) => setData(prev => ({ ...prev, cssrs: val }))} onReset={resetData} />}
              {activeTab === 'trauma' && <TraumaAssessment isAdult={isAdult} ucla={data.ucla} pcl5={data.pcl5} onUCLAChange={(val) => setData(prev => ({ ...prev, ucla: val }))} onPCL5Change={(val) => setData(prev => ({ ...prev, pcl5: val }))} onSkipToResilience={() => setActiveTab('resilience')} />}
              {activeTab === 'resilience' && <ResilienceAssessment age={data.patient.age} data={data.resilience} onChange={(val) => setData(prev => ({ ...prev, resilience: val }))} />}
              {activeTab === 'summary' && <SummarySection data={data} onChange={(val) => setData(prev => ({ ...prev, summary: val }))} />}
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-slate-300 no-print">
          <div className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="w-12 h-px bg-warm-200"></span>
            <span>{isHighRisk ? 'EMERGENCY PROTOCOL MODE' : 'Jianji Clinical Assessment Pro'}</span>
            <span className="w-12 h-px bg-warm-200"></span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
