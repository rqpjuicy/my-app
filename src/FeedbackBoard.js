import React, { useEffect, useRef, useState } from 'react';
import './FeedbackBoard.css';

const STORAGE_KEY = 'feedback_tickets_v1';

const seedTickets = [
  { id: 1, title: '系统无法登录', desc: '多位客户反馈输入验证码后提示“验证失败”，无法进入后台，影响日常操作。', customer: '多位客户', urgency: 'urgent', status: 'pending', progress: 0, createdAt: Date.now() - 1000 * 60 * 35 },
  { id: 2, title: '订单信息不对', desc: '客户反馈订单收货地址与下单时填写的不一致，需核对后台数据并修正。', customer: '李女士', urgency: 'high', status: 'doing', progress: 65, createdAt: Date.now() - 1000 * 60 * 60 * 3 },
  { id: 3, title: '发票开具延迟', desc: '上月申请的增值税发票迟迟未寄出，客户希望本周内收到。', customer: '王先生', urgency: 'medium', status: 'doing', progress: 40, createdAt: Date.now() - 1000 * 60 * 60 * 20 },
  { id: 4, title: '退款未到账', desc: '客户申请退款已超过 3 个工作日仍未到账，现已联系支付渠道处理完成。', customer: '陈女士', urgency: 'high', status: 'done', progress: 100, createdAt: Date.now() - 1000 * 60 * 60 * 48 },
  { id: 5, title: '商品页面加载缓慢', desc: '部分商品详情页图片加载超过 10 秒，建议优化图片资源。', customer: '内部巡检', urgency: 'low', status: 'pending', progress: 0, createdAt: Date.now() - 1000 * 60 * 60 * 72 }
];

const urgencyMeta = {
  low: { label: '低', cls: 'urgency-low', color: '#64748b' },
  medium: { label: '中', cls: 'urgency-medium', color: '#3b82f6' },
  high: { label: '高', cls: 'urgency-high', color: '#f97316' },
  urgent: { label: '紧急', cls: 'urgency-urgent', color: '#ef4444' }
};

const statusMeta = {
  pending: { label: '待处理', cls: 'status-pending', progress: 0 },
  doing: { label: '处理中', cls: 'status-doing', progress: 50 },
  done: { label: '已解决', cls: 'status-done', progress: 100 }
};

const nextStatus = { pending: 'doing', doing: 'done' };
const emptyForm = { title: '', desc: '', customer: '', urgency: 'medium', status: 'pending', progress: 0 };

function normalizeTicket(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  if (!title) return null;

  const status = statusMeta[raw.status] ? raw.status : 'pending';
  const urgency = urgencyMeta[raw.urgency] ? raw.urgency : 'medium';
  let progress = Number(raw.progress);
  if (!isFinite(progress)) progress = statusMeta[status].progress;
  progress = Math.max(0, Math.min(100, progress));

  let createdAt = Number(raw.createdAt);
  if (!isFinite(createdAt) || createdAt <= 0) createdAt = Date.now();

  const id = typeof raw.id === 'number' && isFinite(raw.id) ? raw.id : Date.now() + Math.random();

  return {
    id: id,
    title: title,
    desc: typeof raw.desc === 'string' ? raw.desc : '',
    customer: typeof raw.customer === 'string' ? raw.customer : '',
    urgency: urgency,
    status: status,
    progress: progress,
    createdAt: createdAt
  };
}

function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeTicket).filter(Boolean);
      }
    }
  } catch (e) {
    // 存储不可用时退回示例数据
  }
  return seedTickets.map(normalizeTicket).filter(Boolean);
}

function pad(value) {
  const s = String(value);
  return s.length < 2 ? '0' + s : s;
}

function formatTime(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '时间未知';
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function formatId(id) {
  const s = String(id);
  return s.length >= 4 ? s : ('0000' + s).slice(-4);
}

export default function FeedbackBoard() {
  const [tickets, setTickets] = useState(loadTickets);
  const [query, setQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      // 受限环境下仍可正常使用
    }
  }, [tickets]);

  useEffect(() => {
    const onKeyDown = function (event) {
      if (event.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return function () { window.removeEventListener('keydown', onKeyDown); };
  }, []);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(function () { setToast(''); }, 2200);
  }

  const list = tickets
    .filter(function (t) {
      const q = query.trim().toLowerCase();
      const text = (t.title + ' ' + t.desc + ' ' + t.customer).toLowerCase();
      return (!q || text.indexOf(q) !== -1)
        && (urgencyFilter === 'all' || t.urgency === urgencyFilter)
        && (statusFilter === 'all' || t.status === statusFilter);
    })
    .sort(function (a, b) { return b.createdAt - a.createdAt; });

  const counts = { all: tickets.length, pending: 0, doing: 0, done: 0 };
  tickets.forEach(function (t) { counts[t.status] = (counts[t.status] || 0) + 1; });

  function openModal(id) {
    const target = typeof id === 'number' ? tickets.find(function (t) { return t.id === id; }) : null;
    setEditingId(target ? target.id : null);
    setForm(target ? {
      title: target.title,
      desc: target.desc,
      customer: target.customer,
      urgency: target.urgency,
      status: target.status,
      progress: target.progress
    } : Object.assign({}, emptyForm));
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleStatusChange(event) {
    const status = event.target.value;
    setForm(Object.assign({}, form, { status: status, progress: statusMeta[status].progress }));
  }

  function saveTicket(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;

    const payload = {
      title: title,
      desc: form.desc.trim(),
      customer: form.customer.trim(),
      urgency: urgencyMeta[form.urgency] ? form.urgency : 'medium',
      status: statusMeta[form.status] ? form.status : 'pending',
      progress: Number(form.progress) || 0
    };
    if (payload.status === 'done') payload.progress = 100;
    if (payload.status === 'pending' && payload.progress > 0) payload.status = 'doing';

    if (editingId !== null) {
      setTickets(function (prev) {
        return prev.map(function (t) { return t.id === editingId ? Object.assign({}, t, payload) : t; });
      });
      showToast('工单已更新');
    } else {
      const created = normalizeTicket(Object.assign({ id: Date.now(), createdAt: Date.now() }, payload));
      setTickets(function (prev) { return prev.concat([created]); });
      showToast('新工单已创建');
    }
    closeModal();
  }

  function advanceStatus(id) {
    const target = tickets.find(function (t) { return t.id === id; });
    if (!target || !nextStatus[target.status]) return;
    const status = nextStatus[target.status];
    setTickets(function (prev) {
      return prev.map(function (t) {
        return t.id === id ? Object.assign({}, t, { status: status, progress: statusMeta[status].progress }) : t;
      });
    });
    showToast(status === 'done' ? '工单已标记为解决' : '工单已进入处理中');
  }

  function deleteTicket(id) {
    const target = tickets.find(function (t) { return t.id === id; });
    if (!target || !window.confirm('确定删除工单「' + target.title + '」吗？')) return;
    setTickets(function (prev) { return prev.filter(function (t) { return t.id !== id; }); });
    showToast('工单已删除');
  }

  return (
    <div className="feedback-board">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <div className="brand-name">客户反馈工单管理</div>
            <div className="brand-sub">Feedback Ticket Board</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={function () { openModal(); }}>＋ 新建工单</button>
      </header>

      <main className="feedback-main">
        <div className="page-title">问题工单总览</div>
        <div className="page-desc">集中记录客户反馈的问题，跟踪紧急程度与处理进度。</div>
        <p className="hint">数据仅保存在本机浏览器，请避免填写密钥等敏感信息；删除工单即可清理。</p>

        <section className="stats">
          <div className="stat" style={{ '--accent': '#eef2ff' }}>
            <div className="stat-label">工单总数</div>
            <div className="stat-value">{counts.all}</div>
            <div className="stat-icon">📋</div>
          </div>
          <div className="stat" style={{ '--accent': '#fff7ed' }}>
            <div className="stat-label">待处理</div>
            <div className="stat-value">{counts.pending}</div>
            <div className="stat-icon">⏳</div>
          </div>
          <div className="stat" style={{ '--accent': '#eef2ff' }}>
            <div className="stat-label">处理中</div>
            <div className="stat-value">{counts.doing}</div>
            <div className="stat-icon">🔧</div>
          </div>
          <div className="stat" style={{ '--accent': '#ecfdf5' }}>
            <div className="stat-label">已解决</div>
            <div className="stat-value">{counts.done}</div>
            <div className="stat-icon">✅</div>
          </div>
        </section>

        <section className="toolbar">
          <div className="search">
            <span>🔍</span>
            <input type="text" placeholder="搜索问题标题、描述或客户…" value={query} onChange={function (e) { setQuery(e.target.value); }} />
          </div>
          <select className="filter" value={urgencyFilter} onChange={function (e) { setUrgencyFilter(e.target.value); }}>
            <option value="all">全部紧急程度</option>
            <option value="urgent">紧急</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <select className="filter" value={statusFilter} onChange={function (e) { setStatusFilter(e.target.value); }}>
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="doing">处理中</option>
            <option value="done">已解决</option>
          </select>
          <div className="count">共 {list.length} 条工单</div>
        </section>

        {list.length > 0 ? (
          <section className="grid">
            {list.map(function (t) {
              const u = urgencyMeta[t.urgency];
              const s = statusMeta[t.status];
              return (
                <article className="ticket" key={t.id}>
                  <div className="ticket-head">
                    <div>
                      <div className="ticket-id">#{formatId(t.id)}</div>
                      <div className="ticket-title">{t.title}</div>
                    </div>
                    <span className={'badge ' + u.cls}>{u.label}</span>
                  </div>
                  <div className="ticket-desc">{t.desc || '暂无详细描述'}</div>
                  <div className="ticket-meta">
                    <span>👤 {t.customer || '未填写来源'}</span>
                    <span>🕒 {formatTime(t.createdAt)}</span>
                    <span className={'badge ' + s.cls}>{s.label}</span>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-top"><span>处理进度</span><strong>{t.progress}%</strong></div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: t.progress + '%', background: t.status === 'done' ? '#10b981' : u.color }} />
                    </div>
                  </div>
                  <div className="ticket-actions">
                    {nextStatus[t.status] ? (
                      <button className="btn btn-ghost btn-sm" onClick={function () { advanceStatus(t.id); }}>
                        {t.status === 'pending' ? '开始处理' : '标记解决'}
                      </button>
                    ) : (
                      <button className="btn btn-ghost btn-sm" disabled>已完结</button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={function () { openModal(t.id); }}>编辑</button>
                    <button className="btn btn-danger btn-sm" onClick={function () { deleteTicket(t.id); }}>删除</button>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="empty">
            <div className="empty-icon">🗂️</div>
            <h3>暂无匹配的工单</h3>
            <p>试试调整筛选条件，或新建一条客户反馈工单。</p>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-mask" onClick={function (e) { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-head">
              <h2>{editingId !== null ? '编辑工单' : '新建工单'}</h2>
              <button className="close-x" onClick={closeModal} aria-label="关闭">×</button>
            </div>
            <form onSubmit={saveTicket}>
              <div className="field">
                <label htmlFor="titleInput">问题标题 *</label>
                <input id="titleInput" type="text" required maxLength="60" value={form.title} onChange={function (e) { setForm(Object.assign({}, form, { title: e.target.value })); }} placeholder="例如：订单信息不对" />
              </div>
              <div className="field">
                <label htmlFor="descInput">问题内容</label>
                <textarea id="descInput" maxLength="500" value={form.desc} onChange={function (e) { setForm(Object.assign({}, form, { desc: e.target.value })); }} placeholder="详细描述客户反馈的问题、复现步骤或影响范围…" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="customerInput">客户 / 来源</label>
                  <input id="customerInput" type="text" maxLength="30" value={form.customer} onChange={function (e) { setForm(Object.assign({}, form, { customer: e.target.value })); }} placeholder="选填，例如：张先生" />
                </div>
                <div className="field">
                  <label htmlFor="urgencyInput">紧急程度</label>
                  <select id="urgencyInput" value={form.urgency} onChange={function (e) { setForm(Object.assign({}, form, { urgency: e.target.value })); }}>
                    <option value="low">低 — 常规咨询</option>
                    <option value="medium">中 — 影响使用</option>
                    <option value="high">高 — 业务受阻</option>
                    <option value="urgent">紧急 — 大面积故障</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="statusInput">处理进度状态</label>
                <select id="statusInput" value={form.status} onChange={handleStatusChange}>
                  <option value="pending">待处理</option>
                  <option value="doing">处理中</option>
                  <option value="done">已解决</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="progressInput">完成百分比</label>
                <div className="range-row">
                  <input id="progressInput" type="range" min="0" max="100" step="5" value={form.progress} onChange={function (e) { setForm(Object.assign({}, form, { progress: Number(e.target.value) })); }} />
                  <span className="range-value">{form.progress}%</span>
                </div>
                <div className="hint">切换状态时会自动填入建议进度，也可以手动调整。</div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存工单</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={'toast' + (toast ? ' show' : '')}>{toast}</div>
    </div>
  );
}
