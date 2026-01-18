
import React from 'react';

interface Props {
  data: any;
  onChange: (val: any) => void;
}

const SchoolAssessment: React.FC<Props> = ({ data, onChange }) => {
  const updateScore = (section: string, id: string, val: number) => {
    const newData = { ...data };
    newData[section][id] = val;
    onChange(newData);
  };

  return (
    <div className="space-y-16">
      <header className="mb-12">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-2 h-6 bg-teal-600 rounded-full"></div>
          <h2 className="serif text-3xl text-slate-900">学校系统评估 (School Climate)</h2>
        </div>
        <p className="text-slate-400 text-sm">评估环境支持系统，识别学校中的保护性因素与压力源。</p>
      </header>

      <section>
        <ScaleTable 
          title="学校氛围量表（学生版，6-12年级）"
          items={studentItems}
          options={["非常不同意", "不同意", "同意", "非常同意"]}
          scores={data.studentClimate}
          onScore={(id, val) => updateScore('studentClimate', id, val)}
          color="teal"
        />
      </section>

      <section>
        <ScaleTable 
          title="学校氛围量表（家长版）"
          items={parentItems}
          options={["非常不同意", "不同意", "同意", "非常同意"]}
          scores={data.parentClimate}
          onScore={(id, val) => updateScore('parentClimate', id, val)}
          color="brand"
        />
      </section>
    </div>
  );
};

const ScaleTable = ({ title, items, options, scores, onScore, color }: any) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-1/2">在你的学校中......</th>
            {options.map((opt: string) => (
              <th key={opt} className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">{opt}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((text: string, idx: number) => (
            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-3 text-xs font-medium text-slate-700">{text}</td>
              {options.map((_: string, val: number) => (
                <td key={val} className="px-2 py-3 text-center">
                  <button 
                    onClick={() => onScore(idx.toString(), val + 1)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${scores[idx.toString()] === val + 1 ? `bg-${color === 'brand' ? 'brand-600 border-brand-600' : 'teal-600 border-teal-600'}` : 'border-slate-200 hover:border-slate-300'}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const studentItems = [
  "1. 大多数学生会按时交作业",
  "2. 老师尊重不同背景的学生",
  "3. 校规是合理的",
  "4. 学生在学校走廊玩耍是安全的",
  "5. 学校会把规则向学生讲清楚",
  "6. 大多数学生都会尽自己最大努力",
  "7. 老师关心他们的学生",
  "8. 学校对违反校规的处罚是合理的",
  "9. 学生会欺负其他同学",
  "10. 学生们知道他们在学校里应该怎么做",
  "11. 学生们彼此友好相待",
  "12. 大多数学生感到快乐",
  "13. 学生们感到安全",
  "14. 学生会担心别人欺负自己",
  "15. 学生了解学校的规章制度",
  "16. 学生之间互相关心",
  "17. 当学生遇到问题时，老师倾听他们的心声",
  "18. 学校的《行为准则》是合理的",
  "19. 学生们知道他们在这所学校里是安全的",
  "20. 学生知道在学校里应该如何表现",
  "21. 不同背景的学生之间相互尊重",
  "22. 在这里工作的大人们关心学生",
  "23. 大多数学生遵守规则",
  "24. 大多数学生喜欢这所学校",
  "25. 老师喜欢他们的学生",
  "26. 有学生欺负别人",
  "27. 课堂规则是合理的",
  "28. 大多数学生努力学习以取得好成绩",
  "29. 学生之间彼此尊重",
  "30. 学生之间相处融洽",
  "31. 我在这份问卷中说谎了"
];

const parentItems = [
  "1. 老师们倾听家长的关心和顾虑",
  "2. 老师对不同背景的同学给予同样的尊重",
  "3. 校规是合理的",
  "4. 学生在学校走廊玩耍是安全的",
  "5. 这所学校的校规很明确地传达给了学生",
  "6. 总的来说，该校的校园氛围是积极的",
  "7. 老师们关心他们的学生",
  "8. 学校对违反规章制度的处罚是合理的",
  "9. 我对孩子们受到的教育感到满意",
  "10. 学生们知道他们在学校里应该怎么做",
  "11. 学生们彼此友好相待",
  "12. 学生之间相处融洽",
  "13. 学生们感到安全",
  "14. 我对学校的管教感到满意",
  "15. 学生们了解学校的规章制度",
  "16. 学生之间互相关心",
  "17. 当学生有困难的时候，老师倾听他们的心声",
  "18. 学校的规章制度是合理的",
  "19. 学生们知道他们在这所学校里是安全的",
  "20. 学生知道在学校里应该如何表现",
  "21. 不同背景的学生之间相互尊重",
  "22. 在学校工作的大人们关心学生",
  "23. 老师尊重家长",
  "24. 学生遇到问题时，老师与家长合作帮助学生解决问题",
  "25. 老师与家长的沟通良好",
  "26. 学生之间相互尊重",
  "27. 老师喜欢他们的学生",
  "28. 班规是公平的",
  "29. 我喜欢这所学校"
];

export default SchoolAssessment;
