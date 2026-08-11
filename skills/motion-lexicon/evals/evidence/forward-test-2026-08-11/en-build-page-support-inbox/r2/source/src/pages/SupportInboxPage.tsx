import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "../components/ui/Button";
import { LoadingButton } from "../components/ui/LoadingButton";
import { SegmentedControl } from "../components/ui/SegmentedControl";

type TicketStatus = "open" | "waiting" | "resolved";
type Message = { id: string; author: "customer" | "agent"; name: string; time: string; body: string };
type Ticket = { id: string; name: string; initials: string; subject: string; preview: string; status: TicketStatus; priority: "High" | "Normal"; time: string; channel: string; order: string; messages: Message[] };

const initialTickets: Ticket[] = [
  { id: "sup-1842", name: "Maya Chen", initials: "MC", subject: "Export is missing the last two rows", preview: "The CSV we downloaded has 38 records, but the dashboard shows 40.", status: "open", priority: "High", time: "2m", channel: "Email", order: "Pro plan · 3 seats", messages: [{ id: "1", author: "customer", name: "Maya Chen", time: "10:42 AM", body: "Hi team — the CSV we downloaded has 38 records, but the dashboard shows 40. Could you check whether the last two rows are being excluded?" }, { id: "2", author: "agent", name: "Eleanor from Acme", time: "10:49 AM", body: "I’m looking into the export now. I’ll compare the report filters with the generated file and get back to you shortly." }] },
  { id: "sup-1839", name: "Owen Wright", initials: "OW", subject: "Invoice needs our PO number", preview: "Could you add PO-99214 before we process payment?", status: "waiting", priority: "Normal", time: "18m", channel: "Email", order: "Business plan · annual", messages: [{ id: "1", author: "customer", name: "Owen Wright", time: "10:11 AM", body: "Could you add PO-99214 to our latest invoice before we process payment?" }, { id: "2", author: "agent", name: "Eleanor from Acme", time: "10:18 AM", body: "Absolutely. I’ve sent this to billing and will share the updated invoice as soon as it is ready." }] },
  { id: "sup-1834", name: "Lina Park", initials: "LP", subject: "Can I invite a contractor?", preview: "They only need access through the end of the project.", status: "open", priority: "Normal", time: "41m", channel: "Chat", order: "Team plan · 8 seats", messages: [{ id: "1", author: "customer", name: "Lina Park", time: "9:48 AM", body: "Can I invite a contractor? They only need access through the end of the project." }] },
  { id: "sup-1826", name: "Noah Williams", initials: "NW", subject: "SSO setup complete", preview: "That fixed it — thank you for the quick turnaround.", status: "resolved", priority: "Normal", time: "1h", channel: "Email", order: "Enterprise · 42 seats", messages: [{ id: "1", author: "agent", name: "Eleanor from Acme", time: "9:16 AM", body: "The SAML metadata is now active. Please try signing in from your identity provider once more." }, { id: "2", author: "customer", name: "Noah Williams", time: "9:22 AM", body: "That fixed it — thank you for the quick turnaround." }] },
];

const filterOptions = [{ value: "all", label: "All" }, { value: "open", label: "Open" }, { value: "waiting", label: "Waiting" }, { value: "resolved", label: "Resolved" }];
const statusCopy: Record<TicketStatus, string> = { open: "Open", waiting: "Waiting on us", resolved: "Resolved" };

function Icon({ children }: { children: React.ReactNode }) { return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>; }

export function SupportInboxPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("sup-1842");
  const [draft, setDraft] = useState("");
  const activeTicketId = useRef(selectedId);
  activeTicketId.current = selectedId;
  const reduced = useReducedMotion();
  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0];
  const visibleTickets = useMemo(() => tickets.filter((ticket) => (filter === "all" || ticket.status === filter) && `${ticket.name} ${ticket.subject}`.toLowerCase().includes(query.toLowerCase())), [filter, query, tickets]);
  const chooseTicket = (ticket: Ticket) => { setSelectedId(ticket.id); setDraft(""); };
  const sendReply = () => new Promise<void>((resolve, reject) => {
    const ticketId = selected.id;
    const body = draft.trim();
    window.setTimeout(() => {
      if (body.toLowerCase().includes("fail")) { reject(new Error("Simulated send failure")); return; }
      setTickets((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, preview: body, status: "waiting", time: "now", messages: [...ticket.messages, { id: crypto.randomUUID(), author: "agent", name: "Eleanor from Acme", time: "Just now", body }] } : ticket));
      if (activeTicketId.current === ticketId) setDraft("");
      resolve();
    }, 950);
  });
  const setStatus = (status: TicketStatus) => setTickets((current) => current.map((ticket) => ticket.id === selected.id ? { ...ticket, status, time: "now" } : ticket));
  const toggleTheme = () => document.documentElement.classList.toggle("dark");

  return <main className="support-app">
    <header className="support-header">
      <a className="brand focus-target" href="/support" aria-label="Inbox home"><span className="brand-mark">A</span><span>Acme Support</span></a>
      <div className="header-center"><span className="availability-dot"/> Inbox <span className="muted">· 3 active</span></div>
      <div className="header-actions"><Button className="icon-button" aria-label="Search tickets"><Icon><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></Icon></Button><Button className="theme-button" onClick={toggleTheme}>Theme</Button><Button className="avatar-button" aria-label="Open account menu">ER</Button></div>
    </header>
    <div className="inbox-shell">
      <aside className="queue-panel" aria-label="Ticket queue">
        <div className="panel-heading"><div><p className="eyebrow">Support queue</p><h1>Inbox</h1></div><span className="queue-count">{tickets.filter((ticket) => ticket.status !== "resolved").length}</span></div>
        <label className="search-field"><Icon><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></Icon><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets" aria-label="Search tickets"/></label>
        <SegmentedControl options={filterOptions} label="Ticket status" value={filter} onValueChange={setFilter} className="filter-control" />
        <div className="ticket-list" aria-label="Conversations">{visibleTickets.length ? visibleTickets.map((ticket) => <button key={ticket.id} type="button" className={`ticket-row ${selected.id === ticket.id ? "is-selected" : ""}`} onClick={() => chooseTicket(ticket)} aria-current={selected.id === ticket.id ? "page" : undefined}><span className={`ticket-avatar ${ticket.status}`}>{ticket.initials}</span><span className="ticket-copy"><span className="ticket-topline"><strong>{ticket.name}</strong><time>{ticket.time}</time></span><span className="ticket-subject">{ticket.subject}</span><span className="ticket-preview">{ticket.preview}</span></span>{ticket.status === "open" && <span className="unread-dot" aria-label="Open ticket"/>}</button>) : <div className="empty-queue"><strong>No tickets found</strong><span>Try clearing the search or choosing another filter.</span></div>}</div>
      </aside>
      <section className="conversation-panel" aria-label="Active conversation">
        <AnimatePresence mode="wait" initial={false}>{selected && <motion.div key={selected.id} className="conversation-frame" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -5 }} transition={{ duration: reduced ? 0.12 : 0.2, ease: [0.23, 1, 0.32, 1] }}>
          <header className="ticket-header"><div><div className="ticket-title-line"><h2>{selected.subject}</h2><span className={`status-badge ${selected.status}`}>{statusCopy[selected.status]}</span></div><p>#{selected.id.toUpperCase()} · via {selected.channel} · updated {selected.time}</p></div><div className="ticket-actions"><Button className="icon-button" aria-label="More ticket actions"><Icon><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></Icon></Button><Button className="resolve-button" onClick={() => setStatus(selected.status === "resolved" ? "open" : "resolved")}>{selected.status === "resolved" ? "Reopen ticket" : "Resolve ticket"}</Button></div></header>
          <div className="conversation-scroll">{selected.messages.map((message) => <article className={`message ${message.author}`} key={message.id}><div className="message-meta"><span>{message.name}</span><time>{message.time}</time></div><p>{message.body}</p></article>)}</div>
          {selected.status === "resolved" ? <div className="resolved-state"><span className="resolved-icon"><Icon><path d="m5 12 4 4L19 6"/></Icon></span><div><strong>Ticket resolved</strong><p>This conversation is closed. Reopen it if the customer writes back.</p></div><Button onClick={() => setStatus("open")}>Reopen</Button></div> : <div className="composer"><label htmlFor="reply">Reply to {selected.name}</label><textarea id="reply" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a reply…" rows={3}/><div className="composer-footer"><span>{draft.trim() ? "⌘ Enter to send" : "Replies are sent by email"}</span><LoadingButton key={selected.id} onAction={sendReply} disabled={!draft.trim()} pendingLabel="Sending…" successLabel="Sent" errorLabel="Retry send" className="send-button">Send reply</LoadingButton></div></div>}
        </motion.div>}</AnimatePresence>
      </section>
      <aside className="details-panel" aria-label="Ticket details"><div className="customer-card"><span className="customer-avatar">{selected.initials}</span><h2>{selected.name}</h2><a href={`mailto:${selected.name.toLowerCase().replace(" ", ".")}@example.com`}>{selected.name.toLowerCase().replace(" ", ".")}@example.com</a><span className="customer-note">Customer since Mar 2024</span></div><div className="details-section"><p className="eyebrow">Ticket details</p><dl><div><dt>Priority</dt><dd><span className={`priority ${selected.priority.toLowerCase()}`}>{selected.priority}</span></dd></div><div><dt>Channel</dt><dd>{selected.channel}</dd></div><div><dt>Order</dt><dd>{selected.order}</dd></div><div><dt>Assignee</dt><dd>Eleanor Ross</dd></div></dl></div><div className="details-section"><p className="eyebrow">Suggested actions</p><button type="button" className="suggestion">Attach help article <span>→</span></button><button type="button" className="suggestion">View customer timeline <span>→</span></button></div></aside>
    </div>
  </main>;
}
