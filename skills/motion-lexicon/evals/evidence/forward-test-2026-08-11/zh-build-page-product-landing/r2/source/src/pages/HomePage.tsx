import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";

type SceneId = "ecommerce" | "delivery" | "saas";

const scenes: Record<SceneId, {
  label: string; name: string; initials: string; time: string; question: string; intent: string;
  answer: string; source: string; score: string; metric: string; color: string; activity: string;
}> = {
  ecommerce: {
    label: "电商售后", name: "陈若安", initials: "RA", time: "10:42", question: "我的包裹显示已签收，但门口没有收到，可以帮我查一下吗？",
    intent: "物流异常 · 高优先级", answer: "我已为你核对物流记录。包裹由顺丰在今天 10:08 签收，我正在为你发起快递核查；若 24 小时内未找回，我们会优先补发。", source: "退换与物流政策 v3.8", score: "96%", metric: "首响 18 秒", color: "#4568ff", activity: "已生成核查工单 #CS-2084",
  },
  delivery: {
    label: "即时配送", name: "林默", initials: "LM", time: "12:06", question: "骑手已经到附近半小时了，订单怎么还没送到？",
    intent: "配送延迟 · 需安抚", answer: "抱歉让你久等了。骑手正在处理前序订单，预计 12 分钟内送达。我已为本单发放 12 元延误券，并会持续同步配送进度。", source: "配送异常 SOP · 华东", score: "94%", metric: "挽回 72%", color: "#c86a37", activity: "已同步延迟补偿与新 ETA",
  },
  saas: {
    label: "SaaS 支持", name: "周北", initials: "ZB", time: "16:18", question: "邀请同事时一直提示权限不足，管理员已经给了我成员管理权限。",
    intent: "权限配置 · 可解决", answer: "我找到了原因：你的工作区开启了 SSO 域名限制。请让管理员在「安全设置」中允许 @northstar.io 域名，保存后即可邀请成员。", source: "SSO 与成员权限指南", score: "98%", metric: "解决率 89%", color: "#39785b", activity: "已附上定位步骤与帮助文档",
  },
};

const faqs = [
  ["星桥会替代我的客服吗？", "不会。星桥先处理重复、高频和可验证的问题；遇到高价值、敏感或低置信度工单，会带着上下文一键转交给人工。"],
  ["可以接入已有的知识库和客服系统吗？", "可以。支持导入 Notion、帮助中心、PDF 与网页，并可接入主流工单系统。上线前会先进行命中与口吻评测。"],
  ["数据如何保护？", "你的资料在传输和存储时均加密。团队方案提供数据保留策略、角色权限和审计记录。"],
  ["多久可以上线？", "大部分团队在一个工作日内完成资料导入、品牌口吻设置和首个场景的灰度发布。"],
];

function ArrowIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function SparkIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2 1.5 5.2L17 9l-5.5 1.8L10 16l-1.5-5.2L3 9l5.5-1.8L10 2Z" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" /></svg>; }

export function HomePage() {
  const [scene, setScene] = useState<SceneId>("ecommerce");
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const reduced = useReducedMotion();
  const active = scenes[scene];
  const sceneItems = useMemo(() => Object.entries(scenes) as [SceneId, typeof active][], []);

  const chooseScene = (next: SceneId) => {
    if (next === scene) return;
    setDirection(Object.keys(scenes).indexOf(next) > Object.keys(scenes).indexOf(scene) ? 1 : -1);
    setScene(next);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFormState("error"); return; }
    setFormState("pending");
    window.setTimeout(() => setFormState("success"), 800);
  };
  const scrollToSignup = () => document.getElementById("signup")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

  return <main>
    <header className="site-header">
      <a className="brand focus-target" href="#top" aria-label="星桥首页"><span className="brand-mark"><SparkIcon /></span><span>星桥</span><small>AI CUSTOMER OPS</small></a>
      <nav aria-label="主导航"><a href="#demo">产品演示</a><a href="#pricing">价格</a><a href="#faq">常见问题</a></nav>
      <div className="header-actions"><button className="theme-toggle focus-target" onClick={() => document.documentElement.classList.toggle("dark")} aria-label="切换深色模式">◐</button><Button className="header-cta" onClick={scrollToSignup}>开始免费试用 <ArrowIcon /></Button></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="kicker"><span></span> 为服务团队而生的 AI</p>
        <h1>让每一次客户对话，<br /><em>都更接近解决。</em></h1>
        <p className="hero-summary">星桥把你的知识、规则与最佳实践，变成可靠的 AI 客服。即时回应、理解上下文、知道何时交给真人。</p>
        <div className="hero-actions"><Button className="primary-button" onClick={scrollToSignup}>免费创建工作区 <ArrowIcon /></Button><a className="text-action focus-target" href="#demo">查看真实演示 <span>↓</span></a></div>
        <div className="trust-row"><span className="avatars"><i>苏</i><i>汪</i><i>林</i></span><span>已帮助 <strong>1,200+</strong> 团队<br />把服务做得更好</span></div>
      </div>
      <motion.div className="hero-notes" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [.23, 1, .32, 1] }}>
        <div className="notes-head"><span>今日服务概览</span><b>实时</b></div>
        <div className="mini-chart"><span style={{height:"38%"}}></span><span style={{height:"59%"}}></span><span style={{height:"46%"}}></span><span style={{height:"75%"}}></span><span style={{height:"62%"}}></span><span style={{height:"91%"}}></span><span style={{height:"72%"}}></span></div>
        <div className="note-metric"><strong>87%</strong><span>问题由 AI 独立解决<br /><b>较上周 +12%</b></span></div>
      </motion.div>
    </section>

    <section className="demo-section" id="demo" aria-labelledby="demo-title">
      <div className="section-heading"><p className="section-label">看见服务如何发生</p><h2 id="demo-title">不是聊天机器人。<br />是能完成工作的客服同事。</h2><p>选择一个真实业务场景，看看星桥如何理解问题、引用规则并给出下一步。</p></div>
      <div className="demo-shell">
        <div className="demo-tabs" role="tablist" aria-label="客服场景">
          {sceneItems.map(([id, item]) => <button key={id} role="tab" type="button" aria-selected={scene === id} aria-controls="scene-panel" tabIndex={scene === id ? 0 : -1} onClick={() => chooseScene(id)} onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const index = sceneItems.findIndex(([key]) => key === scene); const next = (index + (e.key === "ArrowRight" ? 1 : -1) + sceneItems.length) % sceneItems.length; chooseScene(sceneItems[next][0]); (e.currentTarget.parentElement?.querySelectorAll("button")[next] as HTMLButtonElement)?.focus(); } }}><span className="tab-dot" style={{background:item.color}}></span>{item.label}{scene === id && <motion.span layoutId="tab-underline" className="tab-underline" transition={reduced ? {duration:0} : {type:"spring", stiffness:620, damping:42, mass:.35}} />}</button>)}
        </div>
        <div className="demo-panel" id="scene-panel" role="tabpanel" tabIndex={0}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div className="conversation" key={scene} custom={direction} initial={reduced ? {opacity:0} : { opacity: 0, x: direction * 10 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? {opacity:0} : { opacity: 0, x: direction * -8 }} transition={{ duration: reduced ? .12 : .24, ease: [.23, 1, .32, 1] }}>
              <div className="customer-line"><span className="avatar" style={{background:active.color}}>{active.initials}</span><div><div className="person-meta"><b>{active.name}</b><span>{active.time}</span></div><p>{active.question}</p></div></div>
              <div className="intent-line"><span className="intent-pulse" style={{background:active.color}}></span><span>{active.intent}</span><small>已识别</small></div>
              <div className="ai-line"><span className="ai-avatar"><SparkIcon /></span><div><div className="person-meta"><b>星桥 AI</b><span>正在回复</span></div><p>{active.answer}</p><div className="source-chip"><span>↗</span> 依据：{active.source}</div></div></div>
            </motion.div>
          </AnimatePresence>
          <aside className="demo-sidebar" aria-label="本次服务分析"><div className="side-label">服务判断</div><div className="confidence"><span>回答置信度</span><strong>{active.score}</strong><div><i style={{width:active.score}}></i></div></div><div className="stat-card"><span>预估结果</span><strong>{active.metric}</strong><small>{active.activity}</small></div><div className="handoff"><span className="handoff-icon">↗</span><p><b>需要人工？</b>完整上下文、引用来源和建议动作会一并转交。</p></div></aside>
        </div>
      </div>
    </section>

    <section className="proof-section"><div className="proof-top"><p className="section-label">为更好的服务而设计</p><p>从首条消息到问题闭环，团队始终拥有清晰的控制权。</p></div><div className="proof-grid"><article><span className="feature-icon">✦</span><h3>先懂业务，再开口</h3><p>连接知识库、商品、订单与规则。每个回答都有依据，不靠猜测。</p><span className="feature-number">01</span></article><article><span className="feature-icon">⌁</span><h3>知道何时请人帮忙</h3><p>低置信度、敏感意图和 VIP 客户自动升级，关键信息不丢失。</p><span className="feature-number">02</span></article><article><span className="feature-icon">▣</span><h3>让改进看得见</h3><p>发现缺失知识与重复问题，把每次对话变成下一次服务的提升。</p><span className="feature-number">03</span></article></div></section>

    <section className="pricing-section" id="pricing"><div className="section-heading pricing-heading"><p className="section-label">清晰的价格，从容地开始</p><h2>为服务增长而付费，<br />不是为复杂度。</h2></div><div className="pricing-grid"><article className="price-card"><p>起步</p><h3>免费体验</h3><div className="price">¥0 <span>/ 月</span></div><ul><li>每月 100 次 AI 对话</li><li>导入 1 个知识源</li><li>基础服务洞察</li></ul><Button onClick={scrollToSignup}>开始使用 <ArrowIcon /></Button></article><article className="price-card featured"><span className="recommended">最受团队欢迎</span><p>成长</p><h3>服务团队</h3><div className="price">¥1,999 <span>/ 月起</span></div><ul><li>不限 AI 对话次数</li><li>多渠道与业务系统接入</li><li>人工协作与质量评测</li></ul><Button className="primary-button" onClick={scrollToSignup}>预约产品顾问 <ArrowIcon /></Button></article><article className="price-card"><p>规模化</p><h3>企业方案</h3><div className="price">按需 <span>定制</span></div><ul><li>私有化与高级安全能力</li><li>专属成功经理</li><li>定制集成与 SLA</li></ul><Button onClick={scrollToSignup}>联系我们 <ArrowIcon /></Button></article></div></section>

    <section className="faq-signup" id="faq"><div className="faq-column"><p className="section-label">常见问题</p><h2>你关心的，<br />我们已经想过。</h2><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div><div className="signup-card" id="signup"><span className="signup-mark"><SparkIcon /></span><p className="section-label">准备好了吗？</p><h2>把第一条更好的<br />回复，交给星桥。</h2><p>免费创建工作区，无需信用卡。</p><form onSubmit={submit} noValidate><label htmlFor="email">工作邮箱</label><input className={formState === "error" ? "has-error" : ""} id="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value); if (formState !== "idle") setFormState("idle");}} placeholder="you@company.com" aria-describedby="form-message" /><Button className="primary-button signup-button" type="submit" disabled={formState === "pending"}>{formState === "pending" ? "正在创建…" : formState === "success" ? "工作区已就绪 ✓" : "免费创建工作区"} <ArrowIcon /></Button><p id="form-message" className={`form-message ${formState}`} aria-live="polite">{formState === "error" ? "请输入有效的工作邮箱后重试。" : formState === "success" ? "欢迎！我们已准备好你的工作区。" : "注册即代表你同意服务条款与隐私政策。"}</p></form></div></section>
    <footer><a className="brand" href="#top"><span className="brand-mark"><SparkIcon /></span><span>星桥</span></a><span>© 2026 星桥 AI 客服</span><div><a href="#faq">隐私</a><a href="#faq">条款</a><a href="#demo">产品更新</a></div></footer>
  </main>;
}
