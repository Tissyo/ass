
import React from 'react';
import { UCLAPTSDData, PCL5Data, TraumaHistory } from '../types';

interface Props {
  isAdult: boolean;
  ucla: UCLAPTSDData;
  pcl5: PCL5Data;
  onUCLAChange: (val: UCLAPTSDData) => void;
  onPCL5Change: (val: PCL5Data) => void;
}

const TraumaAssessment: React.FC<Props> = ({ isAdult, ucla, pcl5, onUCLAChange, onPCL5Change }) => {
  const historyFields: { key: keyof TraumaHistory; label: string }[] = [
    { key: 'naturalDisaster', label: '自然灾害：地震、洪水、飓风、大火等' },
    { key: 'accident', label: '意外事故：严重车祸、高空坠落、溺水等' },
    { key: 'witnessViolence', label: '目睹暴力：家庭暴力、社区暴力等' },
    { key: 'physicalAbuse', label: '身体受虐：被殴打导致受伤或严重痛感' },
    { key: 'sexualTrauma', label: '性创伤：被强迫进行性接触或不适行为' },
    { key: 'loss', label: '丧失：亲近的人突然去世或被害' },
    { key: 'medicalTrauma', label: '医疗创伤：痛苦的手术或重症治疗' }
  ];

  const handleHistoryToggle = (key: keyof TraumaHistory) => {
    if (isAdult) {
      onPCL5Change({ ...pcl5, history: { ...pcl5.history, [key]: !pcl5.history[key] } });
    } else {
      onUCLAChange({ ...ucla, history: { ...ucla.history, [key]: !ucla.history[key] } });
    }
  };

  const handleScore = (id: number, score: number) => {
    const key = id.toString();
    if (isAdult) {
      const newScores = { ...pcl5.scores, [key]: score };
      // Fix: Explicitly type reduce generic as number to avoid unknown type errors in arithmetic addition.
      const total = Object.values(newScores).reduce<number>((a, b) => a + (Number(b) || 0), 0);
      onPCL5Change({ ...pcl5, scores: newScores, totalScore: total });
    } else {
      const newScores = { ...ucla.scores, [key]: score };
      // Fix: Explicitly type reduce generic as number to avoid unknown type errors in arithmetic addition.
      const total = Object.values(newScores).reduce<number>((a, b) => a + (Number(b) || 0), 0);
      onUCLAChange({ ...ucla, scores: newScores, totalScore: total });
    }
  };

  const childQuestions = [
    { id: 1, text: '当我不想去想那件可怕的事情时，它还是会突然冒出来。', grp: '侵入' },
    { id: 2, text: '我会做关于那件事的噩梦，或者很吓人的梦。', grp: '侵入' },
    { id: 3, text: '有时候我会觉得那件可怕的事情好像正在发生一样（闪回）。', grp: '侵入' },
    { id: 4, text: '当看到、听到或闻到某些像那件事的东西时，我会非常难过或害怕。', grp: '侵入' },
    { id: 5, text: '当我想起那件事时，我的身体会有反应（心跳、出汗等）。', grp: '侵入' },
    { id: 6, text: '我尽量不去想、不谈论那件可怕的事情，也不去感受情绪。', grp: '回避' },
    { id: 7, text: '我尽量避开那些会让我想起那件事的人、地方或东西。', grp: '回避' },
    { id: 8, text: '我记不清那件可怕事情的一些重要部分了。', grp: '认知/情绪' },
    { id: 9, text: '我觉得自己很糟糕，或者觉得这个世界很危险。', grp: '认知/情绪' },
    { id: 10, text: '我觉得那件事发生是我的错，或者我导致了坏结果。', grp: '认知/情绪' },
    { id: 11, text: '我很难感到开心、快乐或爱。', grp: '认知/情绪' },
    { id: 12, text: '对我以前喜欢做的事情不再感兴趣了。', grp: '认知/情绪' },
    { id: 13, text: '我觉得跟谁都不亲近，感觉自己是孤单一人。', grp: '认知/情绪' },
    { id: 14, text: '我很容易发脾气，或者容易跟人打架、吵架。', grp: '警觉' },
    { id: 15, text: '我做事情变得不顾危险，或者故意做危险的事。', grp: '警觉' },
    { id: 16, text: '我总是处于高度警惕的状态，时刻注意周围危险。', grp: '警觉' },
    { id: 17, text: '我很容易被突然的声音或动作吓一跳。', grp: '警觉' },
    { id: 18, text: '我很难集中注意力。', grp: '警觉' },
    { id: 19, text: '我很难入睡，或者半夜容易醒来。', grp: '警觉' }
  ];

  const adultQuestions = [
    { id: 1, text: '反复出现关于该压力事件的、令人不安的记忆、想法或画面？', grp: '侵入' },
    { id: 2, text: '反复做关于该压力事件的令人不安的梦？', grp: '侵入' },
    { id: 3, text: '突然感觉该压力事件好像正在重演（仿佛回到了当时）？', grp: '侵入' },
    { id: 4, text: '当某些事物让您想起该压力事件时，您会感到非常沮丧或不安？', grp: '侵入' },
    { id: 5, text: '想起该压力事件时，您会有强烈的生理反应？', grp: '侵入' },
    { id: 6, text: '回避关于该压力事件的记忆、想法或感觉？', grp: '回避' },
    { id: 7, text: '回避外部提醒物（如人、地点、对话、活动）？', grp: '回避' },
    { id: 8, text: '记不起该压力事件的某个重要方面？', grp: '认知/情绪' },
    { id: 9, text: '对自己、他人或世界持有强烈的负面信念？', grp: '认知/情绪' },
    { id: 10, text: '既然发生了该事件，您却责怪自己或他人？', grp: '认知/情绪' },
    { id: 11, text: '持续拥有负面的情绪状态（如恐惧、愤怒、内疚、羞耻）？', grp: '认知/情绪' },
    { id: 12, text: '对以前喜欢的活动明显失去兴趣？', grp: '认知/情绪' },
    { id: 13, text: '感觉与他人疏远或隔绝？', grp: '认知/情绪' },
    { id: 14, text: '难以体验积极的情绪（如无法感到快乐或爱意）？', grp: '认知/情绪' },
    { id: 15, text: '易怒、爆发愤怒或表现出攻击性行为？', grp: '警觉' },
    { id: 16, text: '冒太大的风险或做可能会伤害自己的事情？', grp: '警觉' },
    { id: 17, text: '保持高度警觉、提防卫护？', grp: '警觉' },
    { id: 18, text: '容易受惊吓？', grp: '警觉' },
    { id: 19, text: '注意力难以集中？', grp: '警觉' },
    { id: 20, text: '难以入睡或易醒？', grp: '警觉' }
  ];

  const activeScores = isAdult ? pcl5.scores : ucla.scores;
  const activeQuestions = isAdult ? adultQuestions : childQuestions;
  const activeHistory = isAdult ? pcl5.history : ucla.history;
  const totalScore = isAdult ? pcl5.totalScore : ucla.totalScore;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-purple-500 rounded"></div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isAdult ? '第三部分：创伤评估 (成人 PCL-5)' : '第二部分：创伤评估 (儿童/青少年 UCLA)'}
          </h2>
        </div>
        <div className="text-purple-600 bg-purple-50 px-4 py-1 rounded-full font-bold">
          总分: {totalScore}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="font-bold text-slate-700 mb-4">A. 创伤历史概况 (Trauma History)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {historyFields.map(f => (
            <label key={f.key} className="flex items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-all cursor-pointer">
              <input 
                type="checkbox" 
                checked={activeHistory[f.key]}
                onChange={() => handleHistoryToggle(f.key)}
                className="w-4 h-4 text-purple-600 mr-3"
              />
              <span className="text-sm text-slate-700">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold">
              <th className="p-4 border-b">维度</th>
              <th className="p-4 border-b">条目内容</th>
              <th className="p-4 border-b text-center">评分 (0-4)</th>
            </tr>
          </thead>
          <tbody>
            {activeQuestions.map(q => (
              <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-purple-500 whitespace-nowrap">{q.grp}</td>
                <td className="p-4 text-sm text-slate-700">{q.text}</td>
                <td className="p-4">
                  <div className="flex justify-center space-x-1">
                    {[0,1,2,3,4].map(s => (
                      <button
                        key={s}
                        onClick={() => handleScore(q.id, s)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                          activeScores[q.id.toString()] === s 
                            ? 'bg-purple-600 text-white shadow-md transform scale-110' 
                            : 'bg-white text-slate-400 border border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TraumaAssessment;
