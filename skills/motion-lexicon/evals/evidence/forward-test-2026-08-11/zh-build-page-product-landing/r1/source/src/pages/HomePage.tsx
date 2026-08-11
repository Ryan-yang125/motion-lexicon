import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Accordion, type AccordionItem } from "../components/motion/Accordion";
import { SegmentedControl } from "../components/motion/SegmentedControl";

type SceneId = "presale" | "order" | "incident";

const scenes: Record<SceneId, {
  label: string;
  tag: string;
  customer: string;
  question: string;
  answer: string;
  source: string;
  handoff: string;
  metric: string;
  detail: string;
}> = {
  presale: {
    label: "售前咨询",
    tag: "商品专家 · 已解决",
    customer: "林知夏",
    question: "这款净化器适合 40㎡ 的卧室吗？滤芯多久更换一次？",
    answer: "适合。Air S3 的推荐面积是 25–45㎡，睡眠模式仅 22dB。滤芯在北京这样的城市通常 8–10 个月更换一次；我已为你准备好对比卡片。",
    source: "知识库 · Air S3 规格 / 2026 夏季活动",
    handoff: "无需转人工",
    metric: "92% 自助解决",
    detail: "每 1,000 次咨询节省约 31 小时客服工时",
  },
  order: {
    label: "订单进度",
    tag: "订单助手 · 已解决",
    customer: "张闻远",
    question: "订单 #EK-2608 什么时候能到？地址还能改吗？",
    answer: "你的包裹已在杭州分拨中心，预计明天 18:00 前送达。当前已进入派送准备，地址无法直接修改；我可以为你提交拦截改址申请。",
    source: "订单系统 · 物流轨迹 / 售后规则",
    handoff: "已创建改址申请",
    metric: "48 秒平均处理",
    detail: "自动读取订单状态并执行受控操作",
  },
  incident: {
    label: "异常处理",
    tag: "优先级识别 · 已升级",
    customer: "周予安",
    question: "新买的咖啡机漏水，已经影响到台面了，怎么办？",
    answer: "抱歉影响到你的使用。我已标记为优先售后，并把购买记录、故障描述和处理政策一并交给专员；你无需重复说明。专员将在 3 分钟内接入。",
    source: "服务政策 · 异常分流 / 工单系统",
    handoff: "已带上下文转人工",
    metric: "3 分钟人工接入",
    detail: "高风险场景自动升级，保留完整会话脉络",
  },
};

const faqItems: AccordionItem[] = [
  { id: "security", title: "客户数据如何保护？", meta: "安全", content: "数据传输与存储均加密；你可按角色控制知识库与操作权限，并随时导出审计记录。" },
  { id: "handoff", title: "AI 无法解决时会发生什么？", meta: "协同", content: "它会根据意图、情绪和业务规则升级给人工，并同步摘要、客户资料与已尝试的动作，让客户不必重复描述。" },
  { id: "setup", title: "需要多久能上线？", meta: "上线", content: "连接常用渠道、导入知识库后即可先从一个场景开始。多数团队在一周内完成首个受控工作流。" },
  { id: "channels", title: "支持哪些客户触点？", meta: "渠道", content: "网页聊天、微信、邮件和主流工单系统都可接入；不同渠道可配置不同语气、知识范围与转人工规则。" },
];

const icons = {
  spark: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  route: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v9a4 4 0 0 0 4 4h8"/><path d="m15 14 3 3-3 3"/><circle cx="6" cy="4" r="2"/></svg>,
};

export function HomePage() {
  const [scene, setScene] = useState<SceneId>("presale");
  const [formState, setFormState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const reduced = useReducedMotion();
  const active = scenes[scene];

  const register = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email")?.toString() ?? "";
    if (!email.includes("@")) {
      setFormState("error");
      return;
    }
    setFormState("pending");
    window.setTimeout(() => setFormState("success"), 650);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand focus-target" href="#top" aria-label="Relay AI 客服首页">
          <span className="brand-mark">R</span><span>Relay</span>
        </a>
        <nav className="site-nav" aria-label="页面导航">
          <a href="#demo">场景演示</a><a href="#pricing">价格</a><a href="#faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <button className="theme-button focus-target" type="button" aria-label="切换浅色或深色主题" onClick={() => document.documentElement.classList.toggle("dark")}>
            <span aria-hidden="true">◐</span><span className="theme-label">主题</span>
          </button>
          <a className="button button-primary focus-target" href="#signup">免费开始 <span aria-hidden="true">→</span></a>
        </div>
      </header>

      <section className="hero page-section" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" />AI 客服平台</p>
          <h1 id="hero-title">让每一次回应，<br />都像最懂业务的同事。</h1>
          <p className="hero-lede">Relay 把知识、操作和人工协同放进同一条对话。客户得到即时答案，团队只处理真正需要判断的事。</p>
          <div className="hero-actions">
            <a className="button button-primary focus-target" href="#signup">创建免费工作区 <span aria-hidden="true">→</span></a>
            <a className="button button-quiet focus-target" href="#demo">查看真实场景 <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-note">无需信用卡 · 14 天试用 · 可随时迁移</p>
        </div>
        <aside className="hero-proof" aria-label="客户服务效果">
          <p className="proof-label">本周服务概览</p>
          <strong>18,420</strong><span>次客户对话被妥善处理</span>
          <div className="proof-divider" />
          <div className="proof-stat"><span>平均首次响应</span><b>2.6 秒</b></div>
          <div className="proof-stat"><span>转人工后重复描述</span><b className="good">-64%</b></div>
        </aside>
      </section>

      <section className="demo-section page-section" id="demo" aria-labelledby="demo-title">
        <div className="section-heading demo-heading">
          <div><p className="eyebrow">真实场景演示</p><h2 id="demo-title">上下文一直在，体验不需要重来。</h2></div>
          <p>切换一个场景，看看 Relay 如何读取业务信息、做出判断，并在必要时将完整脉络交给人工。</p>
        </div>
        <div className="demo-shell">
          <div className="demo-toolbar">
            <div><span className="online-dot" />正在模拟一段客户会话</div>
            <SegmentedControl
              label="选择客服场景"
              value={scene}
              onValueChange={(value) => setScene(value as SceneId)}
              options={(Object.keys(scenes) as SceneId[]).map((key) => ({ value: key, label: scenes[key].label }))}
              className="scenario-control"
            />
          </div>
          <div className="demo-grid">
            <section className="conversation-panel" aria-live="polite" aria-label={`${active.label}会话演示`}>
              <motion.div key={scene} initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.12 : 0.24, ease: [0.23, 1, 0.32, 1] }}>
                <div className="conversation-header"><div className="avatar">{active.customer.slice(0, 1)}</div><div><b>{active.customer}</b><span>来自网页聊天 · 刚刚</span></div><span className="status-chip">{active.tag}</span></div>
                <div className="messages"><div className="message customer-message">{active.question}</div><div className="message ai-message"><span className="ai-badge">R</span><div>{active.answer}</div></div></div>
              </motion.div>
              <div className="composer" aria-label="对话输入预览"><span>回复由 Relay 起草并受你的规则约束</span><button className="send-button focus-target" type="button" aria-label="发送回复">↑</button></div>
            </section>
            <aside className="context-panel" aria-label="AI 使用的业务上下文">
              <motion.div key={`context-${scene}`} initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.12 : 0.24, ease: [0.23, 1, 0.32, 1], delay: reduced ? 0 : 0.04 }}>
                <p className="panel-label">本次回答使用</p>
                <div className="context-row"><span>{icons.spark}</span><div><b>{active.source}</b><small>检索到 3 条可信来源</small></div></div>
                <div className="context-row"><span>{icons.route}</span><div><b>{active.handoff}</b><small>按你的服务规则执行</small></div></div>
                <div className="context-row"><span>{icons.shield}</span><div><b>敏感操作受控</b><small>重要动作需要明确授权</small></div></div>
                <div className="outcome-card"><span>预计效果</span><strong>{active.metric}</strong><p>{active.detail}</p></div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      <section className="capabilities page-section" aria-labelledby="capabilities-title">
        <div className="section-heading"><div><p className="eyebrow">可靠地完成服务</p><h2 id="capabilities-title">不只是回答问题，而是推进问题。</h2></div><p>每个回复都能找到依据，每次交接都有完整上下文，每项操作都在你设置的边界内。</p></div>
        <div className="capability-grid">
          {[
            ["理解你的业务", "连接知识库、订单、会员与政策。答案可追溯，更新立即生效。", icons.spark],
            ["完成受控操作", "查询订单、发起申请、更新工单。关键步骤由权限和规则把关。", icons.shield],
            ["无缝协同人工", "识别高优先级情况，将摘要、意图和历史一起交到合适的人手中。", icons.route],
          ].map(([title, text, icon]) => <article className="capability-card" key={title as string}><span className="capability-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="pricing-section page-section" id="pricing" aria-labelledby="pricing-title">
        <div className="section-heading pricing-heading"><div><p className="eyebrow">简单定价</p><h2 id="pricing-title">从一个场景开始，按成果扩展。</h2></div><p>每个方案均含完整审计、知识库连接和人工协同能力。</p></div>
        <div className="pricing-grid">
          <article className="price-card"><p className="price-name">起步</p><p className="price"><sup>¥</sup>0 <span>/ 14 天</span></p><p>适合验证首个客服场景</p><ul><li>1 个渠道接入</li><li>1,000 次对话额度</li><li>基础知识库</li></ul><a className="button button-quiet focus-target" href="#signup">开始试用</a></article>
          <article className="price-card featured"><div className="price-topline"><p className="price-name">成长</p><span>推荐</span></div><p className="price"><sup>¥</sup>2,980 <span>/ 月起</span></p><p>适合正在规模化服务的团队</p><ul><li>多渠道与业务系统</li><li>可配置操作与审批</li><li>实时服务洞察</li></ul><a className="button button-primary focus-target" href="#signup">预约产品顾问 <span aria-hidden="true">→</span></a></article>
          <article className="price-card"><p className="price-name">企业</p><p className="price price-custom">按需定制</p><p>适合复杂组织与高标准治理</p><ul><li>专属安全与部署方案</li><li>高级权限与审计</li><li>专家共创服务</li></ul><a className="button button-quiet focus-target" href="#signup">与我们沟通</a></article>
        </div>
      </section>

      <section className="faq-section page-section" id="faq" aria-labelledby="faq-title">
        <div className="faq-intro"><p className="eyebrow">常见问题</p><h2 id="faq-title">把顾虑讲清楚。</h2><p>还有其他问题？<a className="inline-link" href="mailto:hello@relay.example">联系产品团队</a></p></div>
        <Accordion items={faqItems} defaultOpen={["security"]} className="faq-accordion" />
      </section>

      <section className="signup-section page-section" id="signup" aria-labelledby="signup-title">
        <div><p className="eyebrow">开始使用 Relay</p><h2 id="signup-title">把你的第一条高质量回复，<br />交给 AI。</h2><p>留下工作邮箱，我们会发送一个可直接上手的工作区。</p></div>
        <form className="signup-form" onSubmit={register} noValidate>
          <label htmlFor="email">工作邮箱</label>
          <div className="email-row"><input className="focus-target" id="email" name="email" type="email" placeholder="name@company.com" aria-describedby="signup-status" /><button className="button button-primary focus-target" type="submit" disabled={formState === "pending"}>{formState === "pending" ? "正在创建…" : "创建工作区"}</button></div>
          <p id="signup-status" className={`form-status ${formState}`} role="status">{formState === "success" ? "工作区已创建：请查看你的邮箱完成设置。" : formState === "error" ? "请输入有效的工作邮箱后重试。" : "提交即表示你同意接收 Relay 的产品更新。"}</p>
        </form>
      </section>

      <footer className="site-footer"><span>© 2026 Relay AI</span><span>让客户服务，回到有用的地方。</span><a className="focus-target" href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
