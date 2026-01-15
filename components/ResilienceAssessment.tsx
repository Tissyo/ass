
import React from 'react';

interface Props {
  age: number;
  data: any;
  onChange: (val: any) => void;
}

const ResilienceAssessment: React.FC<Props> = ({ age, data, onChange }) => {
  const isChild = age > 0 && age < 13;
  const isTeen = age >= 13 && age < 18;
  const isAdult = age >= 18;

  const handleScore = (section: string, field: string, id: string, val: number) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[section][field][id] = val;
    onChange(newData);
  };

  const renderChild = () => (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 rounded-4xl text-white shadow-xl shadow-blue-200 flex items-center space-x-6 mb-12">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl shadow-inner">🎒</div>
        <div>
          <h3 className="text-2xl font-bold">我的能量背包 (My Power Pack)</h3>
          <p className="text-blue-100 text-sm mt-1 font-medium opacity-90">来发现你身上那些闪闪发光的超能力吧！</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {[
          { id: '1', text: '当我不开心的时候，我有办法让自己好起来。', grp: '心晴魔法', color: 'blue' },
          { id: '2', text: '我觉得我有优点，我是个棒小孩。', grp: '自信宝石', color: 'amber' },
          { id: '3', text: '当我想要做一件事的时候，我会努力坚持。', grp: '勇气勋章', color: 'orange' },
          { id: '4', text: '当我害怕的时候，我知道可以找谁抱抱。', grp: '温暖港湾', color: 'rose' },
          { id: '5', text: '爸爸/妈妈（或照顾者）很爱我，即使我犯错也爱我。', grp: '超级爱心', color: 'pink' },
          { id: '6', text: '我有朋友可以一起玩，不会觉得孤单。', grp: '快乐伙伴', color: 'indigo' },
          { id: '7', text: '我觉得学校是一个安全的地方。', grp: '智慧基地', color: 'teal' },
          { id: '8', text: '我参加过我很喜欢的兴趣班或活动（画画、运动等）。', grp: '奇妙探险', color: 'purple' }
        ].map(q => (
          <div key={q.id} className="p-6 bg-white border border-slate-100 rounded-3xl flex flex-col md:flex-row justify-between items-center shadow-sm hover:shadow-md transition-all gap-6">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm
                ${q.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                  q.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                  q.color === 'orange' ? 'bg-orange-50 text-orange-500' :
                  q.color === 'rose' ? 'bg-rose-50 text-rose-500' :
                  q.color === 'pink' ? 'bg-pink-50 text-pink-500' :
                  q.color === 'indigo' ? 'bg-indigo-50 text-indigo-500' :
                  q.color === 'teal' ? 'bg-teal-50 text-teal-500' : 'bg-purple-50 text-purple-500'
                }`}>
                {q.id}
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest
                  ${q.color === 'blue' ? 'text-blue-400' : 
                    q.color === 'amber' ? 'text-amber-400' :
                    q.color === 'orange' ? 'text-orange-400' :
                    q.color === 'rose' ? 'text-rose-400' :
                    q.color === 'pink' ? 'text-pink-400' :
                    q.color === 'indigo' ? 'text-indigo-400' :
                    q.color === 'teal' ? 'text-teal-400' : 'text-purple-400'
                  }`}>{q.grp}</span>
                <p className="text-slate-700 font-bold text-lg">{q.text}</p>
              </div>
            </div>
            <div className="flex space-x-3 w-full md:w-auto">
              {[0, 1, 2].map(s => (
                <button
                  key={s}
                  onClick={() => handleScore('child', 'scores', q.id, s)}
                  className={`flex-1 md:px-6 py-4 rounded-2xl border-2 text-sm font-black transition-all transform active:scale-95 ${
                    data.child.scores[q.id] === s 
                    ? (q.color === 'blue' ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-100' : 
                       q.color === 'amber' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100' :
                       q.color === 'orange' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100' :
                       q.color === 'rose' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100' :
                       q.color === 'pink' ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-100' :
                       q.color === 'indigo' ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-100' :
                       q.color === 'teal' ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-100' : 
                       'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-100')
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {s === 0 ? '不像我' : s === 1 ? '有点像' : '很像我'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeen = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center space-x-4 mb-8">
        <div className="text-4xl">🧭</div>
        <div>
          <h3 className="text-xl font-bold text-indigo-800">MNS (My Navigation System) - 导航系统</h3>
          <p className="text-indigo-600 text-sm">青少年优势与支持量表 (13-17岁)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: '1', text: '我身边有一些我很敬佩的人，我想成为像他们那样的人。', grp: '个人能力' },
          { id: '2', text: '我能够与周围的人合作完成任务。', grp: '个人能力' },
          { id: '3', text: '我认为受教育/学习对我未来的生活很重要。', grp: '个人能力' },
          { id: '4', text: '我具备解决生活难题的技能和能力。', grp: '个人能力' },
          { id: '5', text: '我的父母（或监护人）真正了解我是一个怎样的人。', grp: '家庭支持' },
          { id: '6', text: '当我面临困难时，父母（或监护人）会站在我身后支持我。', grp: '家庭支持' },
          { id: '7', text: '我的基本生活需求（如食物、住所）是有保障的。', grp: '家庭支持' },
          { id: '8', text: '我的父母（或监护人）很关注我的行踪和安全。', grp: '家庭支持' },
          { id: '9', text: '我们家在遇到困难时，会聚在一起讨论解决办法。', grp: '社会环境' },
          { id: '10', text: '我通过参与宗教、精神信仰或文化习俗来获得力量。', grp: '社会环境' },
          { id: '11', text: '我觉得我所处的社区/学校环境对我是友好的。', grp: '社会环境' },
          { id: '12', text: '我对我的家庭背景或文化根源感到自豪。', grp: '社会环境' }
        ].map(q => (
          <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-indigo-500 uppercase block mb-1">{q.grp}</span>
            <p className="text-slate-700 text-sm mb-4 h-10 line-clamp-2">{q.text}</p>
            <div className="flex justify-between gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => handleScore('teen', 'scores', q.id, s)}
                  className={`flex-1 h-8 rounded border text-xs transition-all ${
                    data.teen.scores[q.id] === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdult = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-2">1</span>
          心理弹性评估 (CD-RISC-10)
        </h3>
        <div className="space-y-3">
          {[
            { id: '1', text: '我能够适应变化。' },
            { id: '2', text: '无论发生什么事情，我都能应付。' },
            { id: '3', text: '当问题出现时，我能看到事物幽默的一面。' },
            { id: '4', text: '应对压力使我感到更有力量。' },
            { id: '5', text: '经历困难后，我能很快恢复过来（反弹）。' },
            { id: '6', text: '即使有阻碍，我也会努力去实现目标。' },
            { id: '7', text: '在压力之下，我仍然能够保持专注。' },
            { id: '8', text: '即使失败了，我也不会轻易气馁。' },
            { id: '9', text: '我觉得自己是一个坚强的人。' },
            { id: '10', text: '当不得不处理痛苦的情感时，我能处理好。' }
          ].map(q => (
            <div key={q.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
              <p className="text-xs text-slate-700 mb-2">{q.text}</p>
              <div className="flex justify-between gap-1">
                {[0, 1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => handleScore('adult', 'cdrisc', q.id, s)}
                    className={`flex-1 h-6 rounded border text-[10px] ${
                      data.adult.cdrisc[q.id] === s ? 'bg-teal-600 text-white' : 'bg-white text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-2">2</span>
          社会支持评估 (MSPSS)
        </h3>
        <div className="space-y-3">
          {[
            { id: '1', text: '当我有需要时，我很特别的一个人（伴侣/密友）会在我身边。', grp: '重要他人' },
            { id: '2', text: '遇到快乐或悲伤的事，我有很特别的一个人可以分享。', grp: '重要他人' },
            { id: '3', text: '我的家庭能切实地给我所需要的帮助（具体的支持）。', grp: '家庭' },
            { id: '4', text: '我能从我的家庭获得情感上的支持与帮助。', grp: '家庭' },
            { id: '6', text: '当我有需要时，我的朋友们会试着来帮我。', grp: '朋友' },
            { id: '7', text: '当事情出现问题时，我可以指望我的朋友们。', grp: '朋友' },
            { id: '8', text: '我能与我的家人谈论我的难题。', grp: '家庭' },
            { id: '9', text: '我有朋友能与其分享快乐和忧愁。', grp: '朋友' },
            { id: '10', text: '在我的生活中，有一个特别的人关心我的感受。', grp: '重要他人' },
            { id: '11', text: '我的家人愿意帮我做决定。', grp: '家庭' },
            { id: '12', text: '我能与我的朋友们谈论我的难题。', grp: '朋友' }
          ].map(q => (
            <div key={q.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
              <span className="text-[9px] font-bold text-orange-500 uppercase">{q.grp}</span>
              <p className="text-xs text-slate-700 mb-2">{q.text}</p>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map(s => (
                  <button
                    key={s}
                    onClick={() => handleScore('adult', 'mspss', q.id, s)}
                    className={`flex-1 h-6 rounded border text-[10px] ${
                      data.adult.mspss[q.id] === s ? 'bg-orange-600 text-white' : 'bg-white text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section>
      <div className="mb-6 flex items-center space-x-2">
        <div className={`w-1 h-6 ${isChild ? 'bg-blue-500' : 'bg-teal-600'} rounded`}></div>
        <h2 className="text-2xl font-bold text-slate-800">{isChild ? '收集你的能量宝石' : '第四部分：资源与保护因素评估'}</h2>
      </div>
      
      {age <= 0 && <div className="text-center p-20 text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed">请先在基本信息中输入年龄以解锁相应评估模块...</div>}
      {isChild && renderChild()}
      {isTeen && renderTeen()}
      {isAdult && renderAdult()}
    </section>
  );
};

export default ResilienceAssessment;
