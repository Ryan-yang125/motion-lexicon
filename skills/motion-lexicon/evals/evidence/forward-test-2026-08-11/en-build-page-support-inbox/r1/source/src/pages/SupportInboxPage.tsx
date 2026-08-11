import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingButton } from "../../components/motion-lexicon/loading-button";

type TicketStatus = "open" | "waiting" | "resolved";
type TicketPriority = "urgent" | "normal";
type Filter = "all" | "unassigned" | "waiting" | "priority" | "resolved";

type Message = {
  id: string;
  author: string;
  role: "customer" | "agent";
  body: string;
  time: string;
};

type Ticket = {
  id: string;
  customer: string;
  initials: string;
  subject: string;
  preview: string;
  status: TicketStatus;
  priority: TicketPriority;
  unread: boolean;
  assigned: boolean;
  updated: string;
  company: string;
  plan: string;
  email: string;
  location: string;
  localTime: string;
  accountSince: string;
  tags: string[];
  messages: Message[];
};

const STARTING_TICKETS: Ticket[] = [
  {
    id: "#4821",
    customer: "Maya Chen",
    initials: "MC",
    subject: "Unable to invite new teammates",
    preview: "The invite button spins, but nobody receives an email.",
    status: "open",
    priority: "urgent",
    unread: true,
    assigned: true,
    updated: "2m",
    company: "Northstar Labs",
    plan: "Scale · 24 seats",
    email: "maya@northstarlabs.co",
    location: "Vancouver, Canada",
    localTime: "10:42 AM",
    accountSince: "March 2023",
    tags: ["Onboarding", "Email delivery"],
    messages: [
      { id: "m1", author: "Maya Chen", role: "customer", body: "Hi team — I’m trying to invite three new designers. The invite button spins for a few seconds and says sent, but nobody receives an email.", time: "10:31 AM" },
      { id: "m2", author: "Maya Chen", role: "customer", body: "I checked spam and tried two different domains. Could you take a look before our onboarding call today?", time: "10:34 AM" },
      { id: "m3", author: "You", role: "agent", body: "Thanks for the detail, Maya. I can see the invitations are queued but not leaving our mail provider. I’m checking the delivery logs now.", time: "10:37 AM" },
      { id: "m4", author: "Maya Chen", role: "customer", body: "Perfect, thank you. Our call starts in about an hour.", time: "10:40 AM" },
    ],
  },
  {
    id: "#4819",
    customer: "Oliver Grant",
    initials: "OG",
    subject: "Invoice shows an extra seat",
    preview: "We removed a contractor last week but the invoice still lists 12 seats.",
    status: "open",
    priority: "normal",
    unread: true,
    assigned: false,
    updated: "18m",
    company: "Kite & Harbor",
    plan: "Team · 12 seats",
    email: "oliver@kiteharbor.com",
    location: "Brighton, UK",
    localTime: "6:42 PM",
    accountSince: "November 2024",
    tags: ["Billing"],
    messages: [
      { id: "o1", author: "Oliver Grant", role: "customer", body: "Hello, we removed a contractor from our workspace last week, but today’s invoice still lists 12 seats instead of 11. Can you check the adjustment?", time: "10:24 AM" },
      { id: "o2", author: "Oliver Grant", role: "customer", body: "The workspace member count is correct on our side.", time: "10:27 AM" },
    ],
  },
  {
    id: "#4816",
    customer: "Priya Raman",
    initials: "PR",
    subject: "Export finished with missing rows",
    preview: "The CSV has 814 records but the dashboard says 1,204.",
    status: "waiting",
    priority: "normal",
    unread: false,
    assigned: true,
    updated: "1h",
    company: "Good Measure",
    plan: "Scale · 18 seats",
    email: "priya@goodmeasure.in",
    location: "Bengaluru, India",
    localTime: "11:12 PM",
    accountSince: "August 2022",
    tags: ["Exports", "Data"],
    messages: [
      { id: "p1", author: "Priya Raman", role: "customer", body: "Our project export completed, but the CSV contains 814 records while the dashboard shows 1,204. Is there a row limit?", time: "9:02 AM" },
      { id: "p2", author: "You", role: "agent", body: "There shouldn’t be a limit. Could you share the export ID from the confirmation email so I can trace the job?", time: "9:18 AM" },
    ],
  },
  {
    id: "#4808",
    customer: "Jon Bell",
    initials: "JB",
    subject: "SSO setup confirmation",
    preview: "Everything is working now. Thanks for the quick walkthrough.",
    status: "resolved",
    priority: "normal",
    unread: false,
    assigned: true,
    updated: "1d",
    company: "Fieldstone",
    plan: "Enterprise · 68 seats",
    email: "jon@fieldstone.io",
    location: "Austin, USA",
    localTime: "12:42 PM",
    accountSince: "January 2021",
    tags: ["SSO", "Resolved"],
    messages: [
      { id: "j1", author: "Jon Bell", role: "customer", body: "Everything is working now. Thanks for the quick walkthrough.", time: "Yesterday" },
      { id: "j2", author: "You", role: "agent", body: "Glad to hear it, Jon. I’ll mark this as resolved, but you can reply here anytime to reopen it.", time: "Yesterday" },
    ],
  },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All open" },
  { id: "unassigned", label: "Unassigned" },
  { id: "waiting", label: "Waiting" },
  { id: "priority", label: "Priority" },
  { id: "resolved", label: "Resolved" },
];

function Icon({ name }: { name: "inbox" | "search" | "sun" | "arrow" | "check" | "reply" | "person" }) {
  const paths = {
    inbox: <><path d="M3 4.5h14v11H3z"/><path d="M3 11h4l1.4 2h3.2L13 11h4"/></>,
    search: <><circle cx="8.5" cy="8.5" r="5.2"/><path d="m12.5 12.5 4 4"/></>,
    sun: <><circle cx="10" cy="10" r="3.2"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4"/></>,
    arrow: <><path d="M15.5 10H4.5M9 5.5 4.5 10 9 14.5"/></>,
    check: <path d="m4 10 3.5 3.5L16 5.5"/>,
    reply: <><path d="m8 6-4 4 4 4"/><path d="M5 10h6a5 5 0 0 1 5 5"/></>,
    person: <><circle cx="10" cy="7" r="3"/><path d="M4.5 17a5.5 5.5 0 0 1 11 0"/></>,
  };
  return <svg viewBox="0 0 20 20" aria-hidden="true" className="icon">{paths[name]}</svg>;
}

function matchesFilter(ticket: Ticket, filter: Filter) {
  if (filter === "resolved") return ticket.status === "resolved";
  if (ticket.status === "resolved") return false;
  if (filter === "unassigned") return !ticket.assigned;
  if (filter === "waiting") return ticket.status === "waiting";
  if (filter === "priority") return ticket.priority === "urgent";
  return true;
}

export function SupportInboxPage() {
  const reduceMotion = useReducedMotion();
  const [tickets, setTickets] = useState(STARTING_TICKETS);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(STARTING_TICKETS[0].id);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sendingIds, setSendingIds] = useState<string[]>([]);
  const [composerError, setComposerError] = useState<Record<string, string>>({});
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const resolveButtonRef = useRef<HTMLButtonElement>(null);
  const reopenButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filteredTickets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tickets.filter((ticket) => matchesFilter(ticket, filter) && (!needle || `${ticket.customer} ${ticket.subject} ${ticket.id}`.toLowerCase().includes(needle)));
  }, [filter, query, tickets]);

  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? filteredTickets[0] ?? tickets[0];
  const draft = drafts[selected.id] ?? "";
  const isSending = sendingIds.includes(selected.id);

  useEffect(() => {
    if (mobileDetail && window.matchMedia("(max-width: 699px)").matches) {
      backButtonRef.current?.focus();
    }
  }, [mobileDetail, selectedId]);

  const chooseTicket = (ticket: Ticket) => {
    setSelectedId(ticket.id);
    setMobileDetail(true);
    setTickets((current) => current.map((item) => item.id === ticket.id ? { ...item, unread: false } : item));
  };

  const goBack = () => {
    setMobileDetail(false);
    requestAnimationFrame(() => {
      const returnTarget = rowRefs.current[selected.id] ?? rowRefs.current[filteredTickets[0]?.id] ?? searchInputRef.current;
      returnTarget?.focus();
    });
  };

  const sendReply = (ticketId: string, body: string) => {
    const cleanBody = body.trim();
    setComposerError((current) => ({ ...current, [ticketId]: "" }));
    setSendingIds((current) => [...current, ticketId]);

    return new Promise<void>((resolve, reject) => {
      window.setTimeout(() => {
        if (cleanBody.toLowerCase().includes("fail")) {
          setSendingIds((current) => current.filter((id) => id !== ticketId));
          setComposerError((current) => ({ ...current, [ticketId]: "Reply wasn’t sent. Check the connection and try again." }));
          reject(new Error("Simulated reply failure"));
          return;
        }

        setTickets((current) => current.map((ticket) => ticket.id === ticketId ? {
          ...ticket,
          status: "open",
          preview: cleanBody,
          updated: "now",
          messages: [...ticket.messages, { id: `reply-${Date.now()}`, author: "You", role: "agent", body: cleanBody, time: "Just now" }],
        } : ticket));
        setDrafts((current) => current[ticketId] === body ? { ...current, [ticketId]: "" } : current);
        setSendingIds((current) => current.filter((id) => id !== ticketId));
        resolve();
      }, 850);
    });
  };

  const resolveTicket = () => {
    const ticketId = selected.id;
    setTickets((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, status: "resolved", preview: "Conversation resolved", unread: false, updated: "now" } : ticket));
    requestAnimationFrame(() => reopenButtonRef.current?.focus());
  };

  const reopenTicket = () => {
    setTickets((current) => current.map((ticket) => ticket.id === selected.id ? { ...ticket, status: "open", preview: "Conversation reopened", updated: "now" } : ticket));
    requestAnimationFrame(() => resolveButtonRef.current?.focus());
  };

  const counts = Object.fromEntries(FILTERS.map(({ id }) => [id, tickets.filter((ticket) => matchesFilter(ticket, id)).length]));

  return (
    <div className={`support-app ${mobileDetail ? "is-detail" : ""}`}>
      <header className="topbar">
        <a className="brand" href="/support" aria-label="Beacon support inbox">
          <span className="brand-mark"><Icon name="inbox" /></span>
          <span>Beacon</span>
          <span className="brand-section">Support</span>
        </a>
        <div className="topbar-actions">
          <span className="coverage"><span className="presence-dot" /> Coverage online</span>
          <button className="icon-button" aria-label="Toggle color theme" onClick={() => document.documentElement.classList.toggle("dark")}><Icon name="sun" /></button>
          <button className="profile-button" aria-label="Open your profile"><span className="avatar avatar-self">AM</span><span className="profile-name">Alex Morgan</span></button>
        </div>
      </header>

      <main className="inbox-shell">
        <aside className="filter-rail" aria-label="Ticket filters">
          <div className="rail-heading">
            <span>Inbox</span>
            <span className="queue-total">{tickets.filter((ticket) => ticket.status !== "resolved").length}</span>
          </div>
          <nav className="filter-nav">
            {FILTERS.map((item) => (
              <button key={item.id} className={`filter-button ${filter === item.id ? "active" : ""}`} aria-pressed={filter === item.id} onClick={() => { setFilter(item.id); setMobileDetail(false); }}>
                <span>{item.label}</span><span className="filter-count">{counts[item.id]}</span>
              </button>
            ))}
          </nav>
          <div className="rail-footer"><span className="presence-dot" /><span><strong>3 teammates</strong><br />handling the queue</span></div>
        </aside>

        <section className="conversation-list" aria-label="Conversations">
          <div className="list-header">
            <div>
              <p className="eyebrow">Shared inbox</p>
              <h1>{FILTERS.find((item) => item.id === filter)?.label}</h1>
            </div>
            <span className="result-count">{filteredTickets.length} ticket{filteredTickets.length === 1 ? "" : "s"}</span>
          </div>
          <label className="search-field">
            <Icon name="search" />
            <span className="sr-only">Search conversations</span>
            <input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="ticket-scroll" aria-label="Ticket list">
            {filteredTickets.length ? filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                ref={(node) => { rowRefs.current[ticket.id] = node; }}
                className={`ticket-row ${selected.id === ticket.id ? "selected" : ""}`}
                onClick={() => chooseTicket(ticket)}
                aria-current={selected.id === ticket.id ? "true" : undefined}
              >
                <span className={`avatar ${ticket.unread ? "unread-avatar" : ""}`}>{ticket.initials}</span>
                <span className="ticket-copy">
                  <span className="ticket-meta"><strong>{ticket.customer}</strong><span>{ticket.updated}</span></span>
                  <span className="ticket-subject">{ticket.subject}</span>
                  <span className="ticket-preview">{ticket.preview}</span>
                  <span className="ticket-labels">
                    {ticket.priority === "urgent" && <span className="priority-label"><span className="priority-dot" /> Urgent</span>}
                    {!ticket.assigned && <span>Unassigned</span>}
                    {ticket.status === "waiting" && <span>Waiting</span>}
                    {ticket.status === "resolved" && <span className="resolved-label"><Icon name="check" /> Resolved</span>}
                    {sendingIds.includes(ticket.id) && <span className="sending-label">Sending…</span>}
                  </span>
                </span>
                {ticket.unread && <span className="unread-dot" aria-label="Unread" />}
              </button>
            )) : (
              <div className="empty-list"><span className="empty-icon"><Icon name="search" /></span><h2>No conversations found</h2><p>Try another filter or clear your search.</p><button onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button></div>
            )}
          </div>
        </section>

        <section className="ticket-workspace" aria-label={`Ticket ${selected.id}`}>
          <header className="ticket-header">
            <button ref={backButtonRef} className="back-button" onClick={goBack}><Icon name="arrow" /> <span>Inbox</span></button>
            <div className="ticket-title-block">
              <div className="title-line"><span className="ticket-id">{selected.id}</span>{selected.priority === "urgent" && <span className="urgent-badge"><span className="priority-dot" /> Urgent</span>}</div>
              <h2>{selected.subject}</h2>
              <p>{selected.customer} · {selected.company}</p>
            </div>
            {selected.status !== "resolved" && <button ref={resolveButtonRef} className="resolve-button" onClick={resolveTicket}><Icon name="check" /><span>Resolve</span></button>}
          </header>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={selected.id}
              className="thread-and-composer"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -5 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="thread" aria-label="Conversation thread">
                <div className="date-divider"><span>Today</span></div>
                {selected.messages.map((message) => (
                  <article key={message.id} className={`message ${message.role}`}>
                    <div className={`avatar message-avatar ${message.role === "agent" ? "avatar-self" : ""}`}>{message.role === "agent" ? "AM" : selected.initials}</div>
                    <div className="message-content">
                      <div className="message-byline"><strong>{message.author}</strong><span>{message.time}</span></div>
                      <div className="message-bubble"><p>{message.body}</p></div>
                    </div>
                  </article>
                ))}
              </div>

              {selected.status === "resolved" ? (
                <div className="resolved-state" role="status">
                  <span className="resolved-mark"><Icon name="check" /></span>
                  <div><h3>Conversation resolved</h3><p>This ticket is closed and removed from the open queue.</p></div>
                  <button ref={reopenButtonRef} onClick={reopenTicket}>Reopen ticket</button>
                </div>
              ) : (
                <div className="composer">
                  <div className="composer-tabs"><span className="composer-tab active"><Icon name="reply" /> Reply</span></div>
                  <label className="composer-field">
                    <span className="sr-only">Reply to {selected.customer}</span>
                    <textarea
                      value={draft}
                      onChange={(event) => setDrafts((current) => ({ ...current, [selected.id]: event.target.value }))}
                      onKeyDown={(event) => {
                        if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && draft.trim() && !isSending) {
                          event.preventDefault();
                          void sendReply(selected.id, draft).catch(() => undefined);
                        }
                      }}
                      placeholder={`Reply to ${selected.customer}…`}
                    />
                  </label>
                  {composerError[selected.id] && <p className="composer-error" role="alert">{composerError[selected.id]}</p>}
                  <div className="composer-footer">
                    <span className="shortcut-hint">{isSending ? "Reply is sending in the background…" : <>Press <kbd>⌘ Enter</kbd> to send</>}</span>
                    <LoadingButton
                      key={selected.id}
                      className="send-button min-h-11 min-w-28"
                      disabled={!draft.trim() || isSending}
                      onAction={() => sendReply(selected.id, draft)}
                      pendingLabel="Sending…"
                      successLabel="Reply sent"
                      errorLabel="Try again"
                      resetAfter={1600}
                    >
                      Send reply
                    </LoadingButton>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <aside className="customer-panel" aria-label="Customer details">
          <div className="customer-identity"><span className="avatar avatar-large">{selected.initials}</span><h2>{selected.customer}</h2><a href={`mailto:${selected.email}`}>{selected.email}</a></div>
          <div className="detail-section"><h3>Customer</h3><dl><div><dt>Company</dt><dd>{selected.company}</dd></div><div><dt>Plan</dt><dd>{selected.plan}</dd></div><div><dt>Customer since</dt><dd>{selected.accountSince}</dd></div></dl></div>
          <div className="detail-section"><h3>Location</h3><dl><div><dt>Region</dt><dd>{selected.location}</dd></div><div><dt>Local time</dt><dd>{selected.localTime}</dd></div></dl></div>
          <div className="detail-section"><h3>Tags</h3><div className="tag-list">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <div className="assignee-card"><span className="avatar avatar-self">AM</span><span><small>Assigned to</small><strong>Alex Morgan</strong></span><button aria-label="Change assignee"><Icon name="person" /></button></div>
        </aside>
      </main>
    </div>
  );
}
