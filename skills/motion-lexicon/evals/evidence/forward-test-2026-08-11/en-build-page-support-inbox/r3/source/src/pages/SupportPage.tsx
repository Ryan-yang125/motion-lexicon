import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LoadingButton } from "../../components/motion-lexicon/loading-button";

type TicketStatus = "open" | "waiting" | "resolved";
type Filter = "all" | TicketStatus;

type Message = {
  id: string;
  author: string;
  role: "customer" | "agent";
  time: string;
  body: string;
};

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  email: string;
  avatar: string;
  status: TicketStatus;
  priority: "High" | "Normal" | "Low";
  assignee: string;
  updated: string;
  preview: string;
  company: string;
  plan: string;
  locale: string;
  messages: Message[];
};

const seedTickets: Ticket[] = [
  {
    id: "TK-2841",
    subject: "Refund not showing on card",
    customer: "Olivia Martin",
    email: "olivia@northstar.co",
    avatar: "OM",
    status: "open",
    priority: "High",
    assignee: "You",
    updated: "4 min",
    preview: "The refund was approved last week, but I still can’t see it.",
    company: "Northstar Labs",
    plan: "Business",
    locale: "London · 9:42 AM",
    messages: [
      { id: "m1", author: "Olivia Martin", role: "customer", time: "Today, 9:18 AM", body: "Hi! I was told my annual subscription refund was approved last Tuesday, but it still hasn’t appeared on my card. Could you check the status?" },
      { id: "m2", author: "You", role: "agent", time: "Today, 9:31 AM", body: "Absolutely — I found the refund and I’m checking the processor timeline now. I’ll confirm the trace reference shortly." },
      { id: "m3", author: "Olivia Martin", role: "customer", time: "Today, 9:38 AM", body: "Thank you. The original card ends in 4821 if that helps." },
    ],
  },
  {
    id: "TK-2837",
    subject: "Unable to invite a teammate",
    customer: "Marcus Chen",
    email: "marcus@loomcraft.io",
    avatar: "MC",
    status: "waiting",
    priority: "Normal",
    assignee: "Avery",
    updated: "18 min",
    preview: "The invite link expires as soon as they open it.",
    company: "Loomcraft",
    plan: "Team",
    locale: "Vancouver · 1:42 AM",
    messages: [
      { id: "m1", author: "Marcus Chen", role: "customer", time: "Today, 8:54 AM", body: "Every invite I send says it has expired when my teammate opens it. We tried two email addresses." },
      { id: "m2", author: "Avery", role: "agent", time: "Today, 9:24 AM", body: "Thanks, Marcus. Could you send the domain of the affected addresses? I’m checking your workspace policy in parallel." },
    ],
  },
  {
    id: "TK-2829",
    subject: "Invoice needs a VAT number",
    customer: "Sofia Rossi",
    email: "sofia@studioforma.it",
    avatar: "SR",
    status: "open",
    priority: "Normal",
    assignee: "You",
    updated: "42 min",
    preview: "Can you reissue the April invoice with our VAT ID?",
    company: "Studio Forma",
    plan: "Business",
    locale: "Milan · 10:42 AM",
    messages: [
      { id: "m1", author: "Sofia Rossi", role: "customer", time: "Today, 8:47 AM", body: "Could you reissue our April invoice with IT09455210961 in the VAT field? Accounting needs the corrected copy this week." },
    ],
  },
  {
    id: "TK-2814",
    subject: "Export completed successfully",
    customer: "Noah Williams",
    email: "noah@fieldnotes.org",
    avatar: "NW",
    status: "resolved",
    priority: "Low",
    assignee: "You",
    updated: "Yesterday",
    preview: "Got it — the CSV looks perfect now. Thank you!",
    company: "Field Notes",
    plan: "Starter",
    locale: "Austin · 3:42 AM",
    messages: [
      { id: "m1", author: "Noah Williams", role: "customer", time: "Yesterday, 3:12 PM", body: "The export now includes all custom fields. Everything looks right — thank you for the quick fix!" },
      { id: "m2", author: "You", role: "agent", time: "Yesterday, 3:18 PM", body: "Glad it’s sorted. I’m closing this out, but reply anytime if you need another hand." },
    ],
  },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "waiting", label: "Waiting" },
  { id: "resolved", label: "Resolved" },
];

function Icon({ name }: { name: "inbox" | "users" | "chart" | "settings" | "search" | "moon" | "back" | "check" | "paperclip" | "smile" | "more" }) {
  const paths: Record<string, React.ReactNode> = {
    inbox: <><path d="M3 4.5h10l1.5 5v3h-13v-3z"/><path d="M1.5 9.5h3l1 1.5h5l1-1.5h3"/></>,
    users: <><circle cx="6" cy="5" r="2.25"/><path d="M2.5 13c.25-2.4 1.4-3.6 3.5-3.6S9.25 10.6 9.5 13"/><path d="M10.2 4.1a2 2 0 0 1 0 3.8M11 9.6c1.5.3 2.3 1.4 2.5 3.4"/></>,
    chart: <><path d="M2 13.5V8h3v5.5M6.5 13.5V3h3v10.5M11 13.5V6h3v7.5"/><path d="M1.5 13.5h13"/></>,
    settings: <><circle cx="8" cy="8" r="2.25"/><path d="M6.7 1.8h2.6l.5 1.7 1.3.8 1.7-.4 1.3 2.3-1.2 1.2v1.5l1.2 1.2-1.3 2.3-1.7-.4-1.3.8-.5 1.7H6.7l-.5-1.7-1.3-.8-1.7.4-1.3-2.3 1.2-1.2V7.4L1.9 6.2l1.3-2.3 1.7.4 1.3-.8z"/></>,
    search: <><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/></>,
    moon: <path d="M12.8 10.6A5.5 5.5 0 0 1 5.4 3.2 5.5 5.5 0 1 0 12.8 10.6Z"/>,
    back: <><path d="m9.5 3.5-4.5 4 4.5 4"/><path d="M5.5 7.5H14"/></>,
    check: <path d="m3 8 3.2 3.2L13 4.5"/>,
    paperclip: <path d="m6 8.9 4.1-4.1a2.1 2.1 0 0 1 3 3l-5.4 5.4a3.2 3.2 0 0 1-4.5-4.5l5.2-5.2"/>,
    smile: <><circle cx="8" cy="8" r="6"/><path d="M5.2 9.2c.7 1 1.6 1.5 2.8 1.5s2.1-.5 2.8-1.5M5.8 6h.01M10.2 6h.01"/></>,
    more: <><circle cx="3" cy="8" r=".7" fill="currentColor"/><circle cx="8" cy="8" r=".7" fill="currentColor"/><circle cx="13" cy="8" r=".7" fill="currentColor"/></>,
  };
  return <svg aria-hidden="true" className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function StatusDot({ status }: { status: TicketStatus }) {
  return <span className={`status-dot status-dot--${status}`} aria-hidden="true" />;
}

export function SupportPage() {
  const reducedMotion = useReducedMotion();
  const [tickets, setTickets] = useState(seedTickets);
  const [activeId, setActiveId] = useState(seedTickets[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [mobilePane, setMobilePane] = useState<"list" | "detail">("list");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [composerError, setComposerError] = useState("");
  const [notice, setNotice] = useState("");
  const intentVersion = useRef(0);
  const selectedRef = useRef(activeId);
  const pendingTicket = useRef<string | null>(null);

  const activeTicket = tickets.find((ticket) => ticket.id === activeId) ?? tickets[0];
  const draft = drafts[activeTicket.id] ?? "";

  const visibleTickets = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesFilter = filter === "all" || ticket.status === filter;
      const matchesQuery = !term || `${ticket.subject} ${ticket.customer} ${ticket.id}`.toLowerCase().includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [tickets, filter, query]);

  const selectTicket = (id: string) => {
    if (id === selectedRef.current) {
      setMobilePane("detail");
      return;
    }
    const previous = tickets.find((ticket) => ticket.id === selectedRef.current);
    if (pendingTicket.current) {
      setNotice(`Reply to ${previous?.customer ?? "the previous ticket"} canceled. Draft saved.`);
    } else {
      setNotice("");
    }
    intentVersion.current += 1;
    pendingTicket.current = null;
    selectedRef.current = id;
    setActiveId(id);
    setComposerError("");
    setMobilePane("detail");
  };

  const sendReply = async () => {
    const text = draft.trim();
    if (!text) return;
    const ticketId = activeTicket.id;
    const version = ++intentVersion.current;
    pendingTicket.current = ticketId;
    setComposerError("");
    setNotice("");

    await new Promise<void>((resolve, reject) => {
      window.setTimeout(() => {
        if (version !== intentVersion.current || selectedRef.current !== ticketId) {
          reject(new DOMException("Reply interrupted by ticket selection", "AbortError"));
          return;
        }
        if (/\bfail\b/i.test(text)) {
          reject(new Error("Message could not be delivered"));
          return;
        }
        resolve();
      }, 850);
    });

    setTickets((current) => current.map((ticket) => ticket.id === ticketId ? {
      ...ticket,
      preview: text,
      updated: "now",
      status: "waiting",
      messages: [...ticket.messages, { id: `reply-${Date.now()}`, author: "You", role: "agent", time: "Just now", body: text }],
    } : ticket));
    setDrafts((current) => ({ ...current, [ticketId]: "" }));
    pendingTicket.current = null;
    setNotice(`Reply sent to ${activeTicket.customer}.`);
  };

  const resolveTicket = () => {
    intentVersion.current += 1;
    pendingTicket.current = null;
    setTickets((current) => current.map((ticket) => ticket.id === activeTicket.id ? { ...ticket, status: "resolved", updated: "now" } : ticket));
    setNotice(`${activeTicket.id} marked resolved.`);
  };

  const reopenTicket = () => {
    setTickets((current) => current.map((ticket) => ticket.id === activeTicket.id ? { ...ticket, status: "open", updated: "now" } : ticket));
    setNotice(`${activeTicket.id} reopened.`);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleSendError = (error: unknown) => {
    pendingTicket.current = null;
    if (error instanceof DOMException && error.name === "AbortError") return;
    setComposerError("Reply wasn’t delivered. Check the message and try again.");
  };

  return (
    <main className="support-page" data-mobile-pane={mobilePane}>
      <nav className="product-rail" aria-label="Product">
        <a className="brand-mark" href="/support" aria-label="Mercury support">M</a>
        <div className="rail-links">
          <a className="rail-link active" href="/support" aria-label="Inbox"><Icon name="inbox" /><span>Inbox</span></a>
          <button className="rail-link" type="button" aria-label="Customers"><Icon name="users" /><span>Customers</span></button>
          <button className="rail-link" type="button" aria-label="Reports"><Icon name="chart" /><span>Reports</span></button>
        </div>
        <button className="rail-link rail-bottom" type="button" aria-label="Settings"><Icon name="settings" /><span>Settings</span></button>
      </nav>

      <section className="inbox-panel" aria-label="Support inbox">
        <header className="inbox-header">
          <div>
            <p className="eyebrow">Support workspace</p>
            <h1>Inbox</h1>
          </div>
          <div className="header-actions">
            <span className="online-status"><span /> All systems normal</span>
            <button className="icon-button" type="button" aria-label="Toggle dark theme" aria-pressed={isDark} onClick={toggleTheme}><Icon name="moon" /></button>
            <button className="profile-button" type="button" aria-label="Open profile menu">JL</button>
          </div>
        </header>

        <div className="filter-bar">
          <div className="filter-tabs" role="group" aria-label="Filter tickets">
            {filters.map((item) => {
              const count = item.id === "all" ? tickets.length : tickets.filter((ticket) => ticket.status === item.id).length;
              return <button key={item.id} type="button" className={filter === item.id ? "selected" : ""} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}<span>{count}</span></button>;
            })}
          </div>
          <label className="search-field">
            <span className="sr-only">Search tickets</span>
            <Icon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets" />
            <kbd>/</kbd>
          </label>
        </div>

        <div className="inbox-grid">
          <aside className="ticket-list" aria-label="Conversations">
            <div className="list-label"><span>{visibleTickets.length} conversations</span><button type="button" aria-label="Conversation list options"><Icon name="more" /></button></div>
            {visibleTickets.length ? visibleTickets.map((ticket) => (
              <button
                key={ticket.id}
                className={`ticket-row ${activeTicket.id === ticket.id ? "active" : ""}`}
                type="button"
                aria-current={activeTicket.id === ticket.id ? "true" : undefined}
                onClick={() => selectTicket(ticket.id)}
              >
                <span className="avatar">{ticket.avatar}</span>
                <span className="ticket-copy">
                  <span className="ticket-line"><strong>{ticket.customer}</strong><time>{ticket.updated}</time></span>
                  <span className="ticket-subject">{ticket.subject}</span>
                  <span className="ticket-preview">{ticket.preview}</span>
                  <span className="ticket-meta"><span><StatusDot status={ticket.status} />{ticket.status}</span><span>{ticket.id}</span></span>
                </span>
              </button>
            )) : (
              <div className="empty-state"><span className="empty-icon"><Icon name="search" /></span><strong>No tickets found</strong><p>Try another status or search term.</p><button type="button" onClick={() => { setFilter("all"); setQuery(""); }}>Clear filters</button></div>
            )}
          </aside>

          <section className="conversation-panel" aria-label={`Ticket ${activeTicket.id}`}>
            <header className="conversation-header">
              <button className="back-button" type="button" onClick={() => setMobilePane("list")}><Icon name="back" />Inbox</button>
              <div className="conversation-heading">
                <div className="title-line"><h2>{activeTicket.subject}</h2><span className={`status-badge status-badge--${activeTicket.status}`}><StatusDot status={activeTicket.status} />{activeTicket.status}</span></div>
                <p>{activeTicket.id} · {activeTicket.customer} · {activeTicket.email}</p>
              </div>
              <div className="ticket-actions">
                {activeTicket.status !== "resolved" && <button className="resolve-button" type="button" onClick={resolveTicket}><Icon name="check" />Resolve</button>}
                <button className="icon-button" type="button" aria-label="More ticket actions"><Icon name="more" /></button>
              </div>
            </header>

            <div className="conversation-scroll">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTicket.id}
                  className="message-thread"
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  transition={{ duration: reducedMotion ? 0.08 : 0.22, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="date-divider"><span>Today</span></div>
                  {activeTicket.messages.map((message) => (
                    <article className={`message message--${message.role}`} key={message.id}>
                      <span className="avatar avatar--small">{message.role === "agent" ? "JL" : activeTicket.avatar}</span>
                      <div className="message-content">
                        <div className="message-author"><strong>{message.author}</strong>{message.role === "agent" && <span>Support</span>}<time>{message.time}</time></div>
                        <p>{message.body}</p>
                      </div>
                    </article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="composer-region">
              {notice && <div className="inline-notice" role="status"><Icon name="check" />{notice}</div>}
              {activeTicket.status === "resolved" ? (
                <div className="resolved-state">
                  <span className="resolved-mark"><Icon name="check" /></span>
                  <div><strong>Conversation resolved</strong><p>This ticket is closed and removed from the open queue.</p></div>
                  <button type="button" onClick={reopenTicket}>Reopen ticket</button>
                </div>
              ) : (
                <div className={`composer ${composerError ? "composer--error" : ""}`}>
                  <label className="composer-label" htmlFor="reply-message">Reply to {activeTicket.customer}</label>
                  <textarea
                    id="reply-message"
                    value={draft}
                    onChange={(event) => { setDrafts((current) => ({ ...current, [activeTicket.id]: event.target.value })); setComposerError(""); }}
                    placeholder="Type your reply…"
                    rows={3}
                  />
                  {composerError && <p className="composer-error" role="alert">{composerError} <span>Type “fail” to keep testing this recovery state.</span></p>}
                  <div className="composer-toolbar">
                    <div>
                      <button className="composer-tool" type="button" aria-label="Attach file"><Icon name="paperclip" /></button>
                      <button className="composer-tool" type="button" aria-label="Insert emoji"><Icon name="smile" /></button>
                    </div>
                    <div className="send-actions">
                      <LoadingButton
                        key={activeTicket.id}
                        className="send-button min-h-11 min-w-28"
                        onAction={sendReply}
                        onError={handleSendError}
                        disabled={!draft.trim()}
                        pendingLabel="Sending…"
                        successLabel="Sent"
                        errorLabel="Try again"
                      >Send reply</LoadingButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="detail-panel" aria-label="Customer details">
            <div className="customer-card">
              <span className="avatar avatar--large">{activeTicket.avatar}</span>
              <strong>{activeTicket.customer}</strong>
              <a href={`mailto:${activeTicket.email}`}>{activeTicket.email}</a>
            </div>
            <dl className="detail-list">
              <div><dt>Company</dt><dd>{activeTicket.company}</dd></div>
              <div><dt>Plan</dt><dd>{activeTicket.plan}</dd></div>
              <div><dt>Local time</dt><dd>{activeTicket.locale}</dd></div>
              <div><dt>Priority</dt><dd><span className={`priority priority--${activeTicket.priority.toLowerCase()}`}>{activeTicket.priority}</span></dd></div>
              <div><dt>Assignee</dt><dd>{activeTicket.assignee}</dd></div>
            </dl>
            <div className="detail-section"><h3>Tags</h3><div className="tags"><span>billing</span><span>refund</span></div></div>
            <div className="detail-section"><h3>Previous conversations</h3><a href="#history">Payment method update <span>Mar 18</span></a><a href="#history">Plan renewal question <span>Jan 04</span></a></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
