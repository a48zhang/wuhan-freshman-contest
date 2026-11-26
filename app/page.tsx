"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Flag,
  LoaderCircle,
  Terminal,
  UserRound,
} from "lucide-react";

type Theme = "dark" | "light";

interface University {
  id: string;
  code: string;
  name: string;
  shortName: string;
  colors: string[];
}

const UNIVERSITIES: University[] = [
  { id: "hust", code: "HUST", name: "华中科技大学", shortName: "华中科大", colors: ["#0095E8"] },
  { id: "whu", code: "WHU", name: "武汉大学", shortName: "武汉大学", colors: ["#1CA849"] },
  { id: "whut", code: "WHUT", name: "武汉理工大学", shortName: "武汉理工", colors: ["#323CD6", "#FFE800"] },
  { id: "ccnu", code: "CCNU", name: "华中师范大学", shortName: "华中师大", colors: ["#1B7A80"] },
  { id: "hzau", code: "HZAU", name: "华中农业大学", shortName: "华中农大", colors: ["#9CD81B"] },
];

const YEARS = ["2027", "2026", "2025", "2024", "2023", "其他"] as const;

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [schoolInput, setSchoolInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("whfpc-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("whfpc-theme", next);
    } catch {
      // Ignore storage restrictions
    }
  }

  async function copyReceipt() {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = receipt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const d = (await r.json()) as { error?: string; id: string };
      if (!r.ok) throw new Error(d.error || "提交失败，请稍后重试");
      setReceipt(d.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络连接失败，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full max-w-[1220px] mx-auto px-6 sm:px-10 h-[84px] flex items-center justify-between border-b border-[var(--border)]">
        <a href="#" className="flex items-center gap-3 font-bold text-[15px] tracking-tight text-[var(--text)]">
          <img
            src={theme === "light" ? "/whfpc-logo-light.png" : "/whfpc-logo-dark.png"}
            alt="WHFPC 标志"
            className="w-10 h-10 object-contain"
          />
          <span className="font-display text-[15.5px] font-bold tracking-[-0.01em]">武汉联合新生赛</span><span className="hidden sm:inline-block h-3.5 w-px bg-[var(--border-strong)] mx-0.5" aria-hidden="true" /><span className="hidden sm:inline-block font-code text-[10.5px] font-medium tracking-[0.14em] text-[var(--text-muted)]">WHFPC</span>
        </a>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
            className="h-8 px-3 rounded-md border border-[var(--border)] text-[12px] text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          >
            {theme === "dark" ? "☼ 浅色" : "☾ 深色"}
          </button>
          <a
            href="#register"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium hover:opacity-85 transition-opacity"
            style={{ color: "var(--accent-link)" }}
          >
            个人报名 <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-[1180px] mx-auto px-6 sm:px-10 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_490px] gap-12 lg:gap-16 items-start">
        {/* Left Column */}
        <section className="flex flex-col">
          <h1 className="font-display text-[48px] sm:text-[60px] font-black leading-[1.12] tracking-[-0.035em] text-[var(--text)] m-0">
            新生入场，
            <span className="block mt-1" style={{ color: "var(--accent)", textShadow: "var(--headline-glow)" }}>
              自由解题。
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] text-[12px] font-medium tracking-[0.01em] text-[var(--text-secondary)]">
              <UserRound size={14} /> 个人参赛
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] text-[12px] font-medium tracking-[0.01em] text-[var(--text-secondary)]">
              <Terminal size={14} /> ICPC 赛制
            </span>
            <a
              href="#register"
              className="inline-flex items-center gap-1.5 ml-1 text-[13px] font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "var(--accent-link)" }}
            >
              立即报名 <ArrowRight size={15} />
            </a>
          </div>

          {/* Upgraded Visual Composition: Replaces ugly balloons, blobs & sticker with crisp bespoke geometric SVG art framing the authentic WHFPC logo */}
          <div
            className="mt-7 relative rounded-2xl border overflow-hidden h-[270px] sm:h-[290px] flex items-center justify-center"
            style={{
              backgroundColor: "var(--stage-bg)",
              borderColor: "var(--stage-border)",
            }}
          >
            {/* Bespoke Bauhaus-meets-Algorithmic SVG Backdrop */}
            <svg
              viewBox="0 0 560 290"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="whfpcGlowA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(175 110) rotate(35) scale(190 150)">
                  <stop stopColor="#323CD6" stopOpacity={theme === "dark" ? "0.28" : "0.14"} />
                  <stop offset="1" stopColor="#323CD6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="whfpcGlowB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(390 190) rotate(-25) scale(180 140)">
                  <stop stopColor="#1CA849" stopOpacity={theme === "dark" ? "0.2" : "0.12"} />
                  <stop offset="1" stopColor="#9CD81B" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="whfpcOrbit" x1="80" y1="60" x2="480" y2="230" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0095E8" stopOpacity="0.55" />
                  <stop offset="0.35" stopColor="#1CA849" stopOpacity="0.4" />
                  <stop offset="0.65" stopColor="#FFE800" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#9CD81B" stopOpacity="0.45" />
                </linearGradient>
                <pattern id="whfpcDots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill={theme === "dark" ? "#ffffff" : "#181a22"} fillOpacity={theme === "dark" ? "0.08" : "0.09"} />
                </pattern>
              </defs>

              {/* Fine dot matrix */}
              <rect width="560" height="290" fill="url(#whfpcDots)" />

              {/* Soft atmospheric washes */}
              <rect width="560" height="290" fill="url(#whfpcGlowA)" />
              <rect width="560" height="290" fill="url(#whfpcGlowB)" />

              {/* Crisp orbital rings */}
              <ellipse
                cx="280"
                cy="145"
                rx="196"
                ry="88"
                transform="rotate(-11 280 145)"
                stroke="url(#whfpcOrbit)"
                strokeWidth="1.25"
                strokeDasharray="5 5"
              />
              <ellipse
                cx="280"
                cy="145"
                rx="148"
                ry="112"
                transform="rotate(14 280 145)"
                stroke={theme === "dark" ? "#ffffff" : "#181a22"}
                strokeOpacity={theme === "dark" ? "0.1" : "0.1"}
                strokeWidth="1"
              />

              {/* Geometric nodal accents (clean Bauhaus vector geometry, zero balloons) */}
              <circle cx="98" cy="186" r="5" fill="#0095E8" />
              <circle cx="98" cy="186" r="11" stroke="#0095E8" strokeOpacity="0.35" strokeWidth="1" />

              <circle cx="462" cy="102" r="5.5" fill="#FFE800" />
              <circle cx="462" cy="102" r="12" stroke="#FFE800" strokeOpacity="0.35" strokeWidth="1" />

              <rect x="424" y="216" width="8" height="8" rx="2" transform="rotate(45 424 216)" fill="#9CD81B" />
              <circle cx="138" cy="64" r="3.5" fill="#1CA849" />

              {/* Subtle architectural corner marks */}
              <path d="M22 36V22H36" stroke={theme === "dark" ? "#ffffff" : "#181a22"} strokeOpacity="0.22" strokeWidth="1.2" />
              <path d="M538 36V22H524" stroke={theme === "dark" ? "#ffffff" : "#181a22"} strokeOpacity="0.22" strokeWidth="1.2" />
              <path d="M22 254V268H36" stroke={theme === "dark" ? "#ffffff" : "#181a22"} strokeOpacity="0.22" strokeWidth="1.2" />
              <path d="M538 254V268H524" stroke={theme === "dark" ? "#ffffff" : "#181a22"} strokeOpacity="0.22" strokeWidth="1.2" />

              {/* Crisp minimal angle-bracket accents */}
              <path d="M74 114L62 126L74 138" stroke={theme === "dark" ? "#ffffff" : "#181a22"} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M486 152L498 164L486 176" stroke={theme === "dark" ? "#ffffff" : "#181a22"} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Authentic WHFPC Logo */}
            <img
              src={theme === "light" ? "/whfpc-logo-light.png" : "/whfpc-logo-dark.png"}
              alt="武汉联合新生赛 WHFPC 标志"
              className="relative z-10 w-[205px] sm:w-[228px] max-w-[75%] h-auto select-none"
            />
          </div>

          {/* Upgraded Five-University Strip: Replaces ugly square fake badges with crisp color-accented typographic chips */}
          <div className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {UNIVERSITIES.map((uni) => {
                const selected = schoolInput === uni.name;
                return (
                  <button
                    key={uni.id}
                    type="button"
                    title={`点击填入：${uni.name}`}
                    onClick={() => setSchoolInput(uni.name)}
                    className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selected
                        ? "border-[var(--border-strong)] bg-[var(--surface-elevated)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Authentic logo-bar color strip (dual-tone for WHUT) */}
                    <span className="flex flex-col gap-0.5 shrink-0" aria-hidden="true">
                      {uni.colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="w-[3px] rounded-full"
                          style={{
                            height: uni.colors.length > 1 ? "12px" : "26px",
                            backgroundColor: c,
                          }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-code text-[11.5px] font-semibold tracking-[0.04em] text-[var(--text)] leading-tight">
                        {uni.code}
                      </span>
                      <span className="block text-[11.5px] font-medium text-[var(--text-secondary)] truncate mt-0.5">
                        {uni.shortName}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Facts */}
          <div className="mt-6 pt-5 border-t border-[var(--border)] flex flex-wrap gap-10">
            <div>
              <span className="block text-[11px] text-[var(--text-muted)]">时间与地点</span>
              <strong className="block mt-1.5 text-[13px] font-medium text-[var(--text)]">
                待主办方公布
              </strong>
            </div>
            <div>
              <span className="block text-[11px] text-[var(--text-muted)]">联合高校</span>
              <strong className="block mt-1.5 text-[13px] font-medium text-[var(--text)]">
                武汉五校联合举办
              </strong>
            </div>
          </div>
        </section>

        {/* Right Column: Registration Form Card */}
        <section
          id="register"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden scroll-mt-8"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <div className="h-[4px] w-full spectrum-bar" aria-hidden="true" />

          <div className="p-7">
            {receipt ? (
              <div className="py-10 text-center" role="status">
                <span
                  className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "var(--success-bg)", color: "var(--success-fg)" }}
                >
                  <Check size={30} />
                </span>
                <h2 className="text-[24px] font-bold text-[var(--text)] m-0">报名信息已收到</h2>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  请保存下方报名编号。参赛资格及赛事安排以主办方通知为准。
                </p>
                <div className="mt-7 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] p-4 flex items-center justify-between gap-3 text-left">
                  <div>
                    <span className="block text-[11px] text-[var(--text-muted)]">报名编号</span>
                    <strong className="block mt-1 font-mono text-[16px] font-semibold text-[var(--text)]">
                      {receipt}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={copyReceipt}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] text-[12px] text-[var(--text)] cursor-pointer"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "已复制" : "复制"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-[24px] font-bold tracking-[-0.02em] text-[var(--text)] m-0 mb-5">
                  个人报名
                </h2>

                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--border)] text-[12px] font-semibold text-[var(--text-secondary)]">
                    <UserRound size={15} />
                    <span>参赛信息</span>
                    <small className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">
                      * 为必填项
                    </small>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                        姓名 <em className="not-italic" style={{ color: "var(--accent-link)" }}>*</em>
                      </span>
                      <input
                        name="name"
                        placeholder="请输入真实姓名"
                        autoComplete="name"
                        maxLength={40}
                        required
                        className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-input)] text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] field-input focus:outline-none transition-all"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                        学校 <em className="not-italic" style={{ color: "var(--accent-link)" }}>*</em>
                      </span>
                      <input
                        name="school"
                        value={schoolInput}
                        onChange={(e) => setSchoolInput(e.target.value)}
                        placeholder="请输入学校全称"
                        autoComplete="organization"
                        maxLength={100}
                        required
                        className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-input)] text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] field-input focus:outline-none transition-all"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                        学号 <em className="not-italic" style={{ color: "var(--accent-link)" }}>*</em>
                      </span>
                      <input
                        name="studentId"
                        placeholder="请输入学号"
                        maxLength={40}
                        required
                        className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-input)] text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] field-input focus:outline-none transition-all"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                        入学年份 <em className="not-italic" style={{ color: "var(--accent-link)" }}>*</em>
                      </span>
                      <div className="relative">
                        <select
                          name="year"
                          defaultValue=""
                          required
                          className="w-full h-10 pl-3 pr-9 rounded-md border border-[var(--border)] bg-[var(--surface-input)] text-[13px] text-[var(--text)] appearance-none field-input focus:outline-none transition-all"
                        >
                          <option value="" disabled>
                            请选择
                          </option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="block">
                    <span className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                      联系邮箱 <em className="not-italic" style={{ color: "var(--accent-link)" }}>*</em>
                    </span>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength={160}
                      required
                      className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-input)] text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] field-input focus:outline-none transition-all"
                    />
                    <span className="block mt-1.5 text-[11px] text-[var(--text-muted)]">
                      用于接收赛事安排，请确认填写无误。
                    </span>
                  </label>

                  <label className="block">
                    <span className="flex items-center gap-2 text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                      常用昵称
                      <span className="text-[11px] font-normal text-[var(--text-muted)]">选填</span>
                    </span>
                    <input
                      name="nickname"
                      placeholder="选填昵称"
                      maxLength={40}
                      className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-input)] text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] field-input focus:outline-none transition-all"
                    />
                  </label>

                  <div
                    className="flex items-start gap-2.5 rounded-lg p-3 text-[11.5px] leading-relaxed border"
                    style={{
                      background: "var(--notice-bg)",
                      borderColor: "var(--notice-border)",
                      color: "var(--notice-text)",
                    }}
                  >
                    <Flag size={15} className="shrink-0 mt-0.5" />
                    <p className="m-0">参赛资格及具体安排以主办方公告为准。</p>
                  </div>

                  <label className="flex items-start gap-2 text-[11.5px] leading-relaxed text-[var(--text-secondary)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-1 shrink-0"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span>
                      我确认信息真实准确，并同意主办方将以上信息用于本次赛事报名审核与联络。
                      <em className="not-italic ml-0.5" style={{ color: "var(--accent-link)" }}>*</em>
                    </span>
                  </label>

                  {error && (
                    <p className="m-0 text-[12.5px]" style={{ color: "var(--error)" }} role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    disabled={busy}
                    type="submit"
                    className="mt-1 w-full h-11 rounded-lg font-display font-bold text-[13.5px] tracking-[0.03em] flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-wait transition-all cursor-pointer"
                  >
                    {busy ? (
                      <>
                        <LoaderCircle className="animate-spin-fast" size={17} />
                        正在提交
                      </>
                    ) : (
                      <>
                        提交个人报名
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <p className="m-0 text-center text-[11px] text-[var(--text-muted)]">
                    提交成功后将生成报名编号，请留存备查。
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
export default function Home(){
 const [theme,setTheme]=useState("dark");
 useEffect(()=>{const saved=localStorage.getItem("whfpc-theme");if(saved==="light"||saved==="dark")setTheme(saved);},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;},[theme]);
 function toggleTheme(){const next=theme==="dark"?"light":"dark";setTheme(next);localStorage.setItem("whfpc-theme",next);}
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[receipt,setReceipt]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const form=new FormData(e.currentTarget);try{const r=await fetch('/api/registrations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(form))});const d=await r.json() as {error?:string;id:string};if(!r.ok)throw new Error(d.error||'提交失败，请稍后重试');setReceipt(d.id);}catch(e){setError(e instanceof Error?e.message:'网络连接失败，请稍后重试');}finally{setBusy(false);}}
 return <><header><a className="brand" href="#"><img className="logo" src={theme==="light"?"/whfpc-logo-light.png":"/whfpc-logo-dark.png"} alt="WHFPC 标志"/>武汉联合新生赛</a><div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={theme==="dark"?"切换到浅色主题":"切换到深色主题"}>{theme==="dark"?"☼ 浅色":"☾ 深色"}</button><a className="top-link" href="#register">个人报名 <ArrowUpRight size={16}/></a></div></header><main><section className="intro"><h1>新生入场，<span>自由解题。</span></h1><div className="pills"><span><UserRound size={15}/> 个人参赛</span><span><Terminal size={15}/> ICPC 赛制</span></div><a href="#register" className="hero-cta">立即报名 <ArrowRight size={18}/></a><div className="playground"><div className="color-slab slab-purple" aria-hidden="true"/><div className="color-slab slab-lime" aria-hidden="true"/><div className="color-disc" aria-hidden="true"/><div className="orbit-ring" aria-hidden="true"/><div className="identity-art"><img src={theme==="light"?"/whfpc-logo-light.png":"/whfpc-logo-dark.png"} alt="武汉联合新生赛 WHFPC：七种颜色的竖线与手写字标"/></div><span className="sticker ac">✓ ACCEPTED</span><span className="sticker code-sticker">&lt;think /&gt;</span><div className="balloons" aria-label="ICPC 解题气球"><i>A</i><i>B</i><i>C</i></div><span className="doodle-star" aria-hidden="true">✳</span></div><div className="campuses"><div className="campus-nodes" aria-label="五校联合"><span title="华中科技大学">01<i>HUST</i></span><span title="武汉大学">02<i>WHU</i></span><span title="武汉理工大学">03<i>WHUT</i></span><span title="华中师范大学">04<i>CCNU</i></span><span title="华中农业大学">05<i>HZAU</i></span></div></div><div className="facts"><div><span>时间与地点</span><strong>待主办方公布</strong></div></div></section><section className="form-card" id="register"><span className="form-tape" aria-hidden="true"/>{receipt?<div className="success" role="status"><span className="success-icon"><Check size={32}/></span><h2>报名信息已收到</h2><p>请保存下方报名编号。参赛资格及赛事安排以主办方通知为准。</p><div className="receipt">报名编号<strong>{receipt}</strong></div></div>:<><h2>个人报名</h2><form onSubmit={submit}><div className="form-section"><UserRound size={16}/><span>参赛信息</span><small>* 为必填项</small></div><div className="grid"><label>姓名 <em>*</em><input name="name" placeholder="请输入真实姓名" autoComplete="name" maxLength={40} required/></label><label>学校 <em>*</em><input name="school" placeholder="请输入学校全称" autoComplete="organization" maxLength={100} required/></label></div><div className="grid"><label>学号 <em>*</em><input name="studentId" placeholder="请输入学号" maxLength={40} required/></label><label>入学年份 <em>*</em><div className="select"><select name="year" defaultValue="" required><option value="" disabled>请选择</option>{[2027,2026,2025,2024,2023].map(y=><option key={y}>{y}</option>)}<option>其他</option></select><ChevronDown size={15}/></div></label></div><label>联系邮箱 <em>*</em><input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={160} required/><small className="hint">用于接收赛事安排，请确认填写无误。</small></label><label>常用昵称 <span className="optional">选填</span><input name="nickname" placeholder="选填昵称" maxLength={40}/></label><div className="notice"><Flag size={17}/><p>参赛资格及具体安排以主办方公告为准。</p></div><label className="consent"><input type="checkbox" name="consent" required/><span>我确认信息真实准确，并同意主办方将以上信息用于本次赛事报名审核与联络。<em>*</em></span></label>{error&&<p className="error" role="alert">{error}</p>}<button disabled={busy} type="submit">{busy?<><LoaderCircle className="spin" size={18}/> 正在提交</>:<>提交个人报名 <ArrowRight size={18}/></>}</button><p className="form-foot">提交成功后将生成报名编号，请留存备查。</p></form></>}</section></main></>;
}
