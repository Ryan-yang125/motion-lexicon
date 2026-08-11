import { useMemo, useState } from "react";
import { Accordion } from "../components/motion-lexicon/accordion";
import { LoadingButton } from "../components/motion-lexicon/loading-button";
import { Tabs } from "../components/motion-lexicon/tabs";

type Scenario = {
  name: string;
  kicker: string;
  title: string;
  description: string;
  customer: string;
  customerMeta: string;
  question: string;
  answer: string;
  action: string;
  result: string;
  confidence: string;
  sources: string[];
};

const SCENARIOS: Record<string, Scenario> = {
  retail: {
    name: "零售电商",
    kicker: "售前咨询 · 商品推荐",
    title: "从“想要一件外套”到可下单的明确选择",
    description: "织答识别预算、城市温度与尺码偏好，结合实时库存给出可解释的推荐。",
    customer: "林晓雨",
    customerMeta: "来自微信小程序 · 14:32",
    question: "周末去杭州，预算 800 左右，想要一件不容易皱的通勤外套。M 码还有吗？",
    answer: "推荐「轻旅防皱风衣」岩灰色。杭州周末 16–22°C，单穿合适；M 码当前余 12 件，会员价 ¥769。它的再生锦纶面料适合折叠收纳，我也可以帮你保留 30 分钟。",
    action: "已生成商品卡并锁定库存",
    result: "推荐后加购",
    confidence: "96%",
    sources: ["实时库存", "商品知识库", "会员权益"],
  },
  saas: {
    name: "SaaS 服务",
    kicker: "账户支持 · 计费解释",
    title: "把复杂账单解释成客户下一步能完成的操作",
    description: "织答读取套餐、席位变更和发票状态，在权限边界内完成诊断与补救。",
    customer: "陈宇航",
    customerMeta: "来自网页组件 · 10:18",
    question: "这个月账单为什么多了 240 元？我们没有升级套餐。",
    answer: "本月 3 日新增了 4 个编辑席位，按剩余 20 天折算为 ¥240。套餐本身没有变化。我可以导出费用明细，或将未使用的 2 个席位从下个周期移除。",
    action: "已附上账单明细并等待确认",
    result: "一次解决率",
    confidence: "94%",
    sources: ["账单记录", "席位日志", "退款政策"],
  },
  logistics: {
    name: "物流履约",
    kicker: "异常处理 · 主动安抚",
    title: "在客户追问前，解释延误并给出准确承诺",
    description: "织答结合节点轨迹、天气和服务承诺，判断可处理动作并同步工单。",
    customer: "赵安然",
    customerMeta: "来自支付宝生活号 · 18:46",
    question: "快递两天没动了，明天能到上海吗？地址还能改吗？",
    answer: "包裹因合肥分拨中心暴雨延迟，已在今晚 18:21 发往上海，预计明天 16:00–20:00 送达。当前仍可修改同区地址，我可以现在为你提交。",
    action: "已创建地址变更单 · SLA 10 分钟",
    result: "负面评价降低",
    confidence: "91%",
    sources: ["物流轨迹", "天气事件", "服务 SLA"],
  },
};

const FAQS = [
  {
    id: "launch",
    title: "上线需要多久？",
    meta: "部署",
    content: "标准版通常 3–5 个工作日可上线。连接帮助中心、商品或订单数据后，织答会先在沙盒中回放历史对话，通过质量门槛后再逐步放量。",
  },
  {
    id: "handoff",
    title: "什么时候会转给人工客服？",
    meta: "协同",
    content: "当客户主动要求、置信度低于阈值、涉及退款审批或出现高风险情绪时自动转人工。上下文、已查资料和建议动作会一起进入坐席工作台。",
  },
  {
    id: "data",
    title: "企业数据会被用来训练公共模型吗？",
    meta: "安全",
    content: "不会。企业知识、对话与客户资料按租户隔离，不用于训练公共模型。企业版支持私有网络、字段脱敏、审计日志与自定义留存周期。",
  },
  {
    id: "channels",
    title: "支持哪些客服渠道？",
    meta: "渠道",
    content: "支持网页组件、App、微信公众号、小程序、企业微信、邮件和 API 接入。所有渠道共用客户上下文与知识版本。",
  },
  {
    id: "billing",
    title: "对话量如何计费？",
    meta: "计费",
    content: "一次客户问题到解决或转人工计为一轮有效对话；重复刷新、系统通知与测试流量不计费。超出套餐后按阶梯单价结算，并可设置用量预警。",
  },
];

const PLANS = [
  {
    name: "起步版",
    price: "¥999",
    unit: "/ 月",
    description: "适合刚开始自动化客服的小团队",
    features: ["每月 2,000 轮对话", "1 个客服渠道", "标准知识库", "工作日支持"],
    cta: "免费试用",
  },
  {
    name: "专业版",
    price: "¥2,999",
    unit: "/ 月",
    description: "适合有多渠道和人工协同需求的团队",
    features: ["每月 10,000 轮对话", "5 个客服渠道", "订单与 CRM 动作", "质量分析与优先支持"],
    cta: "选择专业版",
    featured: true,
  },
  {
    name: "企业版",
    price: "按需定制",
    unit: "",
    description: "适合复杂权限、合规和专属部署",
    features: ["弹性对话量", "无限渠道", "SSO 与审计日志", "专属成功团队"],
    cta: "联系顾问",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4.5 10.5 3.2 3.1 7.8-8" />
    </svg>
  );
}

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
      <circle cx="10" cy="10" r="3.2" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M16.5 12.4A6.8 6.8 0 0 1 7.6 3.5a6.8 6.8 0 1 0 8.9 8.9Z" />
    </svg>
  );
}

function ProductDemo({ scenario }: { scenario: Scenario }) {
  return (
    <div className="demo-product" data-scenario={scenario.name}>
      <div className="demo-sidebar" aria-hidden="true">
        <div className="demo-brand-mark">织</div>
        <span className="sidebar-dot active" />
        <span className="sidebar-dot" />
        <span className="sidebar-dot" />
      </div>

      <div className="conversation-panel">
        <div className="conversation-head">
          <div className="avatar">{scenario.customer.slice(0, 1)}</div>
          <div>
            <strong>{scenario.customer}</strong>
            <span>{scenario.customerMeta}</span>
          </div>
          <span className="live-status">AI 接待中</span>
        </div>

        <div className="conversation-body">
          <div className="message customer-message">{scenario.question}</div>
          <div className="message ai-message">
            <div className="ai-label"><span>织</span> 织答 AI</div>
            {scenario.answer}
            <div className="source-row">
              {scenario.sources.map((source) => <span key={source}>{source}</span>)}
            </div>
          </div>
          <div className="action-note"><CheckIcon /> {scenario.action}</div>
        </div>

        <div className="composer" aria-hidden="true">
          <span>输入回复，或按 / 调用动作</span>
          <button type="button" tabIndex={-1}>发送</button>
        </div>
      </div>

      <aside className="resolution-panel" aria-label="AI 处理摘要">
        <p className="mini-label">本次处理</p>
        <h3>{scenario.title}</h3>
        <p>{scenario.description}</p>
        <dl>
          <div><dt>答案置信度</dt><dd>{scenario.confidence}</dd></div>
          <div><dt>{scenario.result}</dt><dd>+32%</dd></div>
          <div><dt>人工介入</dt><dd>无需</dd></div>
        </dl>
        <div className="policy-note">
          <span className="shield-icon">✓</span>
          <div><strong>策略检查通过</strong><span>回复与动作均在授权范围内</span></div>
        </div>
      </aside>
    </div>
  );
}

export function HomePage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [activeScenario, setActiveScenario] = useState("retail");
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState("无需信用卡，14 天后再决定是否付费。");

  const tabItems = useMemo(
    () => Object.entries(SCENARIOS).map(([value, item]) => ({ value, label: item.name })),
    [],
  );

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const createWorkspace = async () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setFormMessage("请输入有效的工作邮箱后重试。");
      throw new Error("Invalid email");
    }
    setFormMessage("正在创建你的专属演示工作区…");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setFormMessage(`邀请已发送至 ${email}，请查收邮件。`);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand focus-target" href="#top" aria-label="织答首页">
          <span className="brand-mark">织</span>
          <span>织答</span>
        </a>
        <nav aria-label="主导航">
          <a href="#demo">场景</a>
          <a href="#pricing">价格</a>
          <a href="#faq">问答</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={dark ? "切换到浅色主题" : "切换到深色主题"}>
            <ThemeIcon dark={dark} />
          </button>
          <a className="button button-primary header-cta" href="#signup">免费试用</a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> 懂业务，也懂边界的 AI 客服</p>
            <h1 id="hero-title">每一次客户提问，<br />都得到下一步答案。</h1>
            <p className="hero-lede">织答连接知识、订单与服务流程，用可靠的回答解决问题；需要人工时，完整交接上下文。</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#signup">创建免费工作区 <ArrowIcon /></a>
              <a className="button button-secondary" href="#demo">查看真实场景</a>
            </div>
            <div className="hero-proof" aria-label="产品保障">
              <span><CheckIcon /> 14 天免费试用</span>
              <span><CheckIcon /> 5 天内上线</span>
              <span><CheckIcon /> 随时转人工</span>
            </div>
          </div>

          <div className="hero-summary" aria-label="今日客服摘要">
            <div className="summary-head">
              <div><span className="status-dot" /> 服务运行正常</div>
              <span>今天 14:40</span>
            </div>
            <div className="summary-number"><strong>1,284</strong><span>今日已解决对话</span></div>
            <div className="summary-chart" aria-hidden="true">
              {[38, 48, 43, 62, 56, 74, 68, 88, 82, 92, 76, 86].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="summary-grid">
              <div><span>自动解决率</span><strong>78.6%</strong><small>↑ 6.2%</small></div>
              <div><span>首次响应</span><strong>1.8 秒</strong><small>全天稳定</small></div>
              <div><span>满意度</span><strong>4.82 / 5</strong><small>↑ 0.13</small></div>
            </div>
          </div>
        </section>

        <section className="trust-strip section-shell" aria-label="客户与使用规模">
          <p>已有 320+ 客服团队在使用织答</p>
          <div><span>木棉生活</span><span>云帆科技</span><span>迅途物流</span><span>北辰教育</span><span>青屿健康</span></div>
        </section>

        <section className="demo-section section-shell" id="demo" aria-labelledby="demo-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">真实场景</p>
              <h2 id="demo-title">不是回答得像人，<br />是把事情真正办完。</h2>
            </div>
            <p>切换业务场景，查看织答如何引用真实数据、执行安全动作，并把过程留给团队复核。</p>
          </div>

          <Tabs
            items={tabItems}
            value={activeScenario}
            onValueChange={setActiveScenario}
            label="选择客服演示场景"
            className="demo-tabs"
            panelClassName="demo-tab-panel"
            renderPanel={(value) => <ProductDemo scenario={SCENARIOS[value]} />}
          />
          <p className="sr-only" aria-live="polite">已切换到{SCENARIOS[activeScenario].name}场景</p>
        </section>

        <section className="outcomes section-shell" aria-labelledby="outcomes-title">
          <div className="outcome-intro">
            <p className="eyebrow">从第一天就可衡量</p>
            <h2 id="outcomes-title">让服务质量成为一组可持续改进的数据。</h2>
          </div>
          <div className="outcome-grid">
            <article><strong>78.6%</strong><span>问题自动解决</span><p>复杂问题识别后完整转交，不让客户重复描述。</p></article>
            <article><strong>1.8<span>秒</span></strong><span>平均首次响应</span><p>高峰期同样即时，不牺牲答案准确度。</p></article>
            <article><strong>5<span>天</span></strong><span>平均完成上线</span><p>从历史对话回放到灰度发布，全程可审核。</p></article>
          </div>
        </section>

        <section className="pricing section-shell" id="pricing" aria-labelledby="pricing-title">
          <div className="section-heading centered-heading">
            <p className="eyebrow">清楚、可预期的价格</p>
            <h2 id="pricing-title">从一个渠道开始，随服务规模增长。</h2>
            <p>所有方案都包含知识库、人工转接和基础质量分析。</p>
          </div>
          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <article className={`price-card${plan.featured ? " featured" : ""}`} key={plan.name}>
                {plan.featured && <span className="recommend-label">最受欢迎</span>}
                <div className="plan-head"><h3>{plan.name}</h3><p>{plan.description}</p></div>
                <div className="plan-price"><strong>{plan.price}</strong><span>{plan.unit}</span></div>
                <a className={`button ${plan.featured ? "button-primary" : "button-secondary"}`} href={plan.name === "企业版" ? "mailto:sales@zhida.ai" : "#signup"}>{plan.cta}</a>
                <ul>{plan.features.map((feature) => <li key={feature}><CheckIcon /> {feature}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="pricing-note">年付节省 20% · 价格不含增值税 · 可随时升级方案</p>
        </section>

        <section className="faq-section section-shell" id="faq" aria-labelledby="faq-title">
          <div className="faq-copy">
            <p className="eyebrow">常见问题</p>
            <h2 id="faq-title">开始之前，<br />你可能还想知道。</h2>
            <p>还有具体的集成或合规问题？</p>
            <a className="text-link" href="mailto:hello@zhida.ai">和产品顾问聊聊 <ArrowIcon /></a>
          </div>
          <Accordion items={FAQS} defaultOpen={["launch"]} headingLevel={3} className="faq-accordion" />
        </section>

        <section className="signup-section section-shell" id="signup" aria-labelledby="signup-title">
          <div className="signup-copy">
            <p className="eyebrow light-eyebrow">今天开始</p>
            <h2 id="signup-title">把第一位 AI 客服，<br />放进真实业务里。</h2>
            <p>创建工作区后，我们会用你的帮助中心搭好第一版演示。不改系统，也能先看到效果。</p>
          </div>
          <form className="signup-form" onSubmit={(event) => event.preventDefault()} noValidate>
            <label htmlFor="work-email">工作邮箱</label>
            <div className="signup-control">
              <input id="work-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setFormMessage("无需信用卡，14 天后再决定是否付费。"); }} placeholder="you@company.com" autoComplete="email" />
              <LoadingButton
                onAction={createWorkspace}
                onError={() => undefined}
                pendingLabel="正在创建"
                successLabel="工作区已创建"
                errorLabel="请检查邮箱"
                resetAfter={2600}
                className="signup-submit"
              >
                免费开始
              </LoadingButton>
            </div>
            <p className={formMessage.startsWith("请输入") ? "form-note error-note" : "form-note"} aria-live="polite">{formMessage}</p>
          </form>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="brand focus-target" href="#top"><span className="brand-mark">织</span><span>织答</span></a>
        <p>可靠回答每一个客户问题。</p>
        <div><a href="mailto:hello@zhida.ai">联系我们</a><a href="#faq">服务条款</a><span>© 2026 织答科技</span></div>
      </footer>
    </div>
  );
}
