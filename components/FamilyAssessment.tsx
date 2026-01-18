
import React from 'react';

interface Props {
  data: any;
  onChange: (val: any) => void;
}

const FamilyAssessment: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (section: string, field: string, value: any) => {
    const newData = { ...data };
    if (field === '') {
      newData[section] = value;
    } else if (field.includes('.')) {
      const [f1, f2] = field.split('.');
      newData[section][f1][f2] = value;
    } else {
      newData[section][field] = value;
    }
    onChange(newData);
  };

  const updateScore = (section: string, id: string, val: number) => {
    const newData = { ...data };
    newData[section][id] = val;
    onChange(newData);
  };

  return (
    <div className="space-y-20">
      {/* 1. 家谱图访谈 */}
      <section>
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-brand-600 rounded-full"></div>
            <h2 className="serif text-3xl text-slate-900">1. 家谱图访谈 (Genogram Interview)</h2>
          </div>
          <p className="text-slate-400 text-sm">记录至少三代家庭成员的信息与关系，分析问题的环境背景与跨代模式。</p>
        </header>
        
        <div className="space-y-8">
          <InterviewBox 
            title="（1）当前问题与家庭状况" 
            placeholder="成员关系、居住情况、最近大事件、各成员对问题的反应、求助模式..."
            value={data.genogramCurrent}
            onChange={(val) => updateField('genogramCurrent', '', val)}
          />
          <InterviewBox 
            title="（2）广泛家庭背景" 
            placeholder="父母原生家庭、排行、出生地、职业/教育、健康、过世情况、至少三代人信息..."
            value={data.genogramBackground}
            onChange={(val) => updateField('genogramBackground', '', val)}
          />
          <InterviewBox 
            title="（3）简要访谈【可选】" 
            placeholder="最大压力事件、秘密/隐私、最受欢迎的人、目前最大的挑战、核心诉求..."
            value={data.genogramBrief}
            onChange={(val) => updateField('genogramBrief', '', val)}
          />
        </div>
      </section>

      {/* 2. 依恋代际传递 */}
      <section>
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
            <h2 className="serif text-3xl text-slate-900">2. 依恋代际传递评估</h2>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-8">
          <InterviewBox 
            title="早期依恋心理状态" 
            placeholder="与父母早年关系描述、第一次分离反应、不安时的安慰方式、被拒绝/受挫/受伤经历..."
            value={data.attachment.parent}
            onChange={(val) => updateField('attachment', 'parent', val)}
          />
          <InterviewBox 
            title="影响依恋安全性的因素" 
            placeholder="成长中关系的改变、性格形成的影响、与他人交往方式、婚姻/育儿方式的关联..."
            value={data.attachment.child}
            onChange={(val) => updateField('attachment', 'child', val)}
          />
        </div>
      </section>

      {/* 3. 家庭功能评估量表 */}
      <section className="space-y-16">
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
            <h2 className="serif text-3xl text-slate-900">3. 家庭功能评估 (FFAS & FAD)</h2>
          </div>
        </header>

        <ScaleTable 
          title="FFAS-C (儿童用家庭功能评估量表)"
          items={[
            "1. 在我家，我们会互相讨论对自己来说很重要的事情",
            "2. 在我家，经常每个人都不讲真话",
            "3. 在我家，每个人都能认真听其他人说话",
            "4. 家里人有不同的意见会让我觉得很害怕，很担心",
            "5. 在我家，我们觉得处理日常遇到的事情很吃力",
            "6. 我的家人彼此信任",
            "7. 待在家里让我觉得很痛苦",
            "8. 在我家，当有人生气的时候他就故意不理人",
            "9. 我的家里总是会发生一个又一个麻烦事",
            "10. 在我家，当有人不开心的时候，其他人都会去关心他（她）",
            "11. 在我家，很多事情总是会出错",
            "12. 我们家的每个人都很讨厌彼此",
            "13. 我的家人对彼此的生活插手或管得太多",
            "14. 在我家，每当事情变得不好的时候大家就互相指责",
            "15. 我们善于用新的方法去处理困难的事"
          ]}
          options={["一点也不像", "不太像", "有点像", "像", "非常像"]}
          scores={data.ffas}
          onScore={(id, val) => updateScore('ffas', id, val)}
        />

        <ScaleTable 
          title="FAD-12 (家庭功能评定量表——总体功能分量表)"
          items={[
            "1. 由于我们彼此误解，难于安排一些家庭活动。",
            "2. 发生危机时，我们能相互支持。",
            "3. 我们不能相互谈论我们的担忧。",
            "4. 无论每个人是什么样的，都能被其他家庭成员接受。",
            "5. 我们避免谈及我们害怕和关注的事。",
            "6. 我们能相互表达出自己的感受。",
            "7. 家庭的情绪气氛很不好。",
            "8. 我们感到能被其他家庭成员容忍。",
            "9. 在我们家，对事情做出决定是困难的。",
            "10. 我们能够对如何解决问题做出决定。",
            "11. 我们不能和睦相处。",
            "12. 我们相互依赖。"
          ]}
          options={["完全不像我家", "不像我家", "像我家", "很像我家"]}
          scores={data.fad}
          onScore={(id, val) => updateScore('fad', id, val)}
        />
      </section>

      {/* 4. 养育压力与方式 */}
      <section className="space-y-16">
        <header className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
            <h2 className="serif text-3xl text-slate-900">4. 养育压力与养育方式</h2>
          </div>
        </header>

        <ScaleTable 
          title="PSI-SF-15 (简版养育压力指数)"
          items={[
            "1. 我无法应对新异事物",
            "2. 我感觉我总是无法做一些自己想做的事情",
            "3. 我不太满意上次买的衣服",
            "4. 每次出去聚会我总是预计到自己不会玩得尽兴",
            "5. 我不再像以前那样对一些事物感兴趣了",
            "6. 我的孩子很少做出让我觉得比较满意的事情",
            "7. 大多数时候,我觉得我的孩子并不喜欢我",
            "8. 我的孩子冲我微笑的次数比我期待的少多了",
            "9. 我的孩子能做好的事情比我预想的少",
            "10. 我的孩子很难适应新事物",
            "11. 和大多数孩子相比,我的孩子似乎更爱哭、更易烦恼",
            "12. 我感觉我的孩子非常情绪化",
            "13. 我的孩子有时做的事情很让我生气",
            "14. 当有些事情发生时,我的孩子反应太过激烈",
            "15. 我的孩子做了一些让我确实感到很烦恼的事情"
          ]}
          options={["完全不符合", "比较不符合", "一般", "比较符合", "完全符合"]}
          scores={data.psi}
          onScore={(id, val) => updateScore('psi', id, val)}
        />

        <ScaleTable 
          title="PPFQ (父母养育心理灵活性问卷)"
          items={[
            "1. 我的情绪阻碍我成为自己心目中完美的父亲/母亲。",
            "2. 我的担忧阻碍自己成为一位出色的父亲/母亲。",
            "3. 我的情绪导致自已和孩子之间出现问题。",
            "4. 我认为绝大多数父母都比我做得好。",
            "5. 痛苦的记忆让我不能够按照自己希望的方式来教养孩子。",
            "6. 我的感受阻碍了自己做对孩子有益的事情。",
            "7. 我担心不能控制自己对孩子的情绪。",
            "8. 心情好的时候我才能向孩子表达关爱。",
            "9. 有很多事情我不能让孩子和小伙伴们去做，因为我觉得如果出了事情...",
            "10. 因为过分担心孩子，我曾经不让孩子做他们认为重要的事情",
            "11. 我不允许孩子做令我担心的事情。",
            "12. 即使在我感到疲惫、紧张、悲伤或愤怒的时候，我仍能承担起教养责任。",
            "13. 即使生孩子的气，我仍然能做一个好父亲/母亲。",
            "14. 无论我想什么或有什么感受，我都能和孩子保持良好的关系。",
            "15. 无论我的感受如何，都不会影响我如何对待孩子。",
            "16. 教养孩子时的不可预知性使做父母变得有趣和有收获。"
          ]}
          options={["1", "2", "3", "4", "5", "6", "7"]}
          scores={data.ppfq}
          onScore={(id, val) => updateScore('ppfq', id, val)}
        />

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">APQ (Alabama 父母教养问卷 - 儿童版)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-2/5">题目内容</th>
                  <th className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">从未(1)</th>
                  <th className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">几乎从不(2)</th>
                  <th className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">有时(3)</th>
                  <th className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">经常(4)</th>
                  <th className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">总是(5)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {apqItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{item.text}</td>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <td key={v} className="px-2 py-4 text-center">
                          <button onClick={() => updateScore('apq', item.id, v)} className={`w-5 h-5 rounded-full border-2 transition-all ${data.apq[item.id] === v ? 'bg-brand-600 border-brand-600' : 'border-slate-200'}`} />
                        </td>
                      ))}
                    </tr>
                    {item.hasDad && (
                      <tr className="bg-brand-50/20">
                        <td className="px-10 py-3 text-[11px] font-medium text-brand-600">└ 爸爸呢？</td>
                        {[1, 2, 3, 4, 5].map((v) => (
                          <td key={v} className="px-2 py-3 text-center">
                            <button onClick={() => updateScore('apq', item.id + '_dad', v)} className={`w-4 h-4 rounded-full border-2 transition-all ${data.apq[item.id + '_dad'] === v ? 'bg-brand-500 border-brand-500' : 'border-slate-200'}`} />
                          </td>
                        ))}
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const InterviewBox = ({ title, placeholder, value, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mr-2"></span>
      {title}
    </label>
    <textarea
      className="w-full h-32 p-5 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:border-brand-200 focus:bg-white transition-all text-sm leading-relaxed"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ScaleTable = ({ title, items, options, scores, onScore }: any) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-1/2">评估条目</th>
            {options.map((opt: string) => (
              <th key={opt} className="px-2 py-4 text-[10px] font-black text-slate-400 text-center">{opt}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((text: string, idx: number) => (
            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4 text-xs font-medium text-slate-700">{text}</td>
              {options.map((_: string, val: number) => (
                <td key={val} className="px-2 py-4 text-center">
                  <button 
                    onClick={() => onScore(idx.toString(), val + 1)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${scores[idx.toString()] === val + 1 ? 'bg-brand-600 border-brand-600' : 'border-slate-200 hover:border-brand-200'}`}
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

const apqItems = [
  { id: '1', text: '1. 你会和妈妈友好地聊天。', hasDad: true },
  { id: '2', text: '2. 你的父母会告诉你：你做得很好。' },
  { id: '3', text: '3. 你的父母会威胁要惩罚你，但后来并不真的这样做。' },
  { id: '4', text: '4. 妈妈会帮助你参加一些特别的活动。', hasDad: true },
  { id: '5', text: '5. 当你表现好时，你的父母会奖励你，或额外给你一些东西。' },
  { id: '6', text: '6. 你外出时，没有给父母留字条，也没有告诉他们你要去哪里。' },
  { id: '7', text: '7. 你会和妈妈一起玩游戏，或做其他好玩的事情。', hasDad: true },
  { id: '8', text: '8. 当你做错事后，你会劝父母不要惩罚你。' },
  { id: '9', text: '9. 妈妈会问你：你在学校这一天过得怎么样。', hasDad: true },
  { id: '10', text: '10. 你晚上在外面待到很晚，超过了你应该回家的时间。' },
  { id: '11', text: '11. 妈妈会辅导你做作业。', hasDad: true },
  { id: '12', text: '12. 你的父母觉得让你听话太麻烦，于是干脆放弃继续管你。' },
  { id: '13', text: '13. 当你做得好时，你的父母会夸奖你。' },
  { id: '14', text: '14. 妈妈会问你：你明天（或接下来一天）有什么计划。', hasDad: true },
  { id: '15', text: '15. 妈妈会开车送你去参加某个特别的活动。', hasDad: true },
  { id: '16', text: '16. 当你表现好时，你的父母会表扬你。' },
  { id: '17', text: '17. 你的父母不知道你正在和哪些朋友在一起。' },
  { id: '18', text: '18. 当你做得好时，你的父母会拥抱你或亲吻你。' },
  { id: '19', text: '19. 你外出时，没有约定回家的时间。' },
  { id: '20', text: '20. 妈妈会和你聊你的朋友。', hasDad: true },
  { id: '21', text: '21. 天黑后，你会在没有大人陪同的情况下外出。' },
  { id: '22', text: '22. 你的父母会让你提前结束惩罚。' },
  { id: '23', text: '23. 你会帮忙计划家庭活动。' },
  { id: '24', text: '24. 你的父母忙到忘了你在哪里、在做什么。' },
  { id: '25', text: '25. 当你做错事时，你的父母不惩罚你。' },
  { id: '26', text: '26. 妈妈会去学校开会，比如家长会或和老师面谈。', hasDad: true },
  { id: '27', text: '27. 当你帮忙做家务时，你的父母会告诉你：他们很喜欢你这样做。' },
  { id: '28', text: '28. 你在外面待到很晚，但你的父母并不知道。' },
  { id: '29', text: '29. 你的父母出门时不会告诉你他们要去哪里。' },
  { id: '30', text: '30. 放学后你回家晚了一个多小时，超过了父母希望的时间。' },
  { id: '31', text: '31. 父母对你的惩罚，会因为他们当天的心情不同而不一样。' },
  { id: '32', text: '32. 你会一个人在家，没有大人在场。' },
  { id: '33', text: '33. 当你做错事时，你的父母会用手打你屁股。' },
  { id: '34', text: '34. 当你不听话时，你的父母会不理你。' },
  { id: '35', text: '35. 当你做错事时，你的父母会扇你耳光。' },
  { id: '36', text: '36. 你的父母会拿走你的某些权利（或零花钱）作为惩罚。' },
  { id: '37', text: '37. 你的父母会让你回自己房间作为惩罚。' },
  { id: '38', text: '38. 当你做错事时，你的父母会用皮带、棍子或其他东西打你。' },
  { id: '39', text: '39. 当你做错事时，你的父母会对你大喊大叫。' },
  { id: '40', text: '40. 当你不听话时，你的父母会平静地向你解释行为为什么不对。' },
  { id: '41', text: '41. 你的父母会用“冷静时间”作为惩罚。' },
  { id: '42', text: '42. 你的父母会让你做额外的家务作为惩罚。' }
];

export default FamilyAssessment;
