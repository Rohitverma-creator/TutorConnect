import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Particle canvas background ──────────────────────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
};

// ── Styles injected once ─────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById("tt-styles")) return;
  const style = document.createElement("style");
  style.id = "tt-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Raleway:wght@300;400;500;600&display=swap');

    :root {
      --gold: #D4AF37;
      --gold-light: #F5D77E;
      --gold-dim: rgba(212,175,55,0.15);
      --bg: #0a0a0f;
      --surface: #111118;
      --surface2: #16161f;
      --border: rgba(212,175,55,0.25);
      --text: #EDE8DC;
      --muted: rgba(237,232,220,0.45);
    }

    .tt-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .tt-root { font-family: 'Raleway', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

    /* Hero header */
    .tt-hero { text-align: center; padding: 80px 24px 48px; position: relative; }
    .tt-hero::after {
      content:''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 120px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .tt-badge {
      display: inline-block; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 4px;
      color: var(--gold); border: 1px solid var(--border); padding: 6px 18px; border-radius: 2px;
      margin-bottom: 24px; text-transform: uppercase; opacity: 0;
    }
    .tt-title {
      font-family: 'Cinzel', serif; font-size: clamp(2.2rem, 6vw, 4.5rem);
      font-weight: 900; line-height: 1.1; opacity: 0;
      background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, #9A7B1A 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      letter-spacing: -1px;
    }
    .tt-subtitle { font-size: 13px; letter-spacing: 3px; color: var(--muted); margin-top: 12px; opacity: 0; text-transform: uppercase; }

    /* Form card */
    .tt-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 4px; padding: 40px 36px; max-width: 700px; margin: 48px auto;
      position: relative; overflow: hidden; opacity: 0;
    }
    .tt-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .tt-card-title {
      font-family: 'Cinzel', serif; font-size: 1.1rem; letter-spacing: 2px; color: var(--gold);
      text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;
    }
    .tt-card-title::before {
      content: ''; display: block; width: 24px; height: 1px; background: var(--gold);
    }

    /* Inputs */
    .tt-input, .tt-select {
      width: 100%; background: var(--bg); border: 1px solid var(--border);
      color: var(--text); padding: 14px 18px; border-radius: 3px; font-family: 'Raleway', sans-serif;
      font-size: 14px; outline: none; transition: border-color 0.3s, box-shadow 0.3s;
      margin-bottom: 16px;
    }
    .tt-input::placeholder { color: var(--muted); }
    .tt-input:focus, .tt-select:focus {
      border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
    }
    .tt-select option { background: var(--surface); color: var(--text); }

    .tt-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media(max-width: 520px) { .tt-grid-2 { grid-template-columns: 1fr; } }

    /* Button */
    .tt-btn {
      width: 100%; padding: 16px; background: transparent;
      border: 1px solid var(--gold); color: var(--gold);
      font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 3px; text-transform: uppercase;
      cursor: pointer; border-radius: 3px; margin-top: 8px; position: relative; overflow: hidden;
      transition: color 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .tt-btn::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--gold), #9A7B1A);
      transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .tt-btn:hover::before { transform: translateX(0); }
    .tt-btn:hover { color: #0a0a0f; }
    .tt-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .tt-btn span { position: relative; z-index: 1; }

    /* Spinner */
    .tt-spinner {
      width: 16px; height: 16px; border: 2px solid var(--gold);
      border-top-color: transparent; border-radius: 50%;
      animation: spin 0.7s linear infinite; position: relative; z-index: 1;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Error */
    .tt-error {
      background: rgba(220,50,50,0.08); border: 1px solid rgba(220,50,50,0.3);
      color: #ff6b6b; padding: 10px 14px; border-radius: 3px; font-size: 13px; margin-bottom: 16px;
    }

    /* Timetable section */
    .tt-section-title {
      font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 3px; color: var(--gold);
      text-transform: uppercase; text-align: center; margin-bottom: 32px; position: relative;
    }
    .tt-section-title::before, .tt-section-title::after {
      content: ''; position: absolute; top: 50%; width: 80px; height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold));
    }
    .tt-section-title::before { right: calc(50% + 120px); transform: translateY(-50%); }
    .tt-section-title::after {
      left: calc(50% + 120px); transform: translateY(-50%) scaleX(-1);
    }

    /* Day cards */
    .tt-days-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 0 24px; max-width: 1200px; margin: 0 auto 80px; }

    .tt-day-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 4px;
      padding: 24px; position: relative; overflow: hidden; opacity: 0; transform: translateY(40px);
    }
    .tt-day-card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .tt-day-name {
      font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 3px; color: var(--gold);
      text-transform: uppercase; margin-bottom: 16px; padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .tt-slot {
      display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px;
      border-radius: 3px; margin-bottom: 8px; transition: background 0.2s;
    }
    .tt-slot:hover { background: var(--gold-dim); }
    .tt-slot-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
    .tt-slot-time { font-size: 10px; letter-spacing: 1px; color: var(--muted); text-transform: uppercase; }
    .tt-slot-subject { font-size: 13px; font-weight: 600; color: var(--text); }
    .tt-slot-badge {
      font-size: 9px; letter-spacing: 1px; color: var(--gold); background: var(--gold-dim);
      border: 1px solid rgba(212,175,55,0.3); padding: 2px 7px; border-radius: 2px; margin-top: 2px; display: inline-block;
    }

    /* History section */
    .tt-history-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px 80px; }
    .tt-history-item {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 4px; padding: 24px; margin-bottom: 20px;
      position: relative; opacity: 0; transform: translateX(-30px);
    }
    .tt-history-item::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
      background: linear-gradient(180deg, var(--gold), transparent);
      border-radius: 4px 0 0 4px;
    }
    .tt-history-date { font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 14px; }
    .tt-history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
    .tt-history-day { background: var(--bg); border: 1px solid var(--border); border-radius: 3px; padding: 12px; }
    .tt-history-day-name { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 2px; color: var(--gold); margin-bottom: 8px; }
    .tt-history-slot { font-size: 11px; color: var(--muted); padding: 2px 0; }

    /* Divider */
    .tt-divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); margin: 60px auto; }

    /* Numbers decoration */
    .tt-deco-num {
      position: absolute; font-family: 'Cinzel', serif; font-size: 120px; font-weight: 900;
      color: rgba(212,175,55,0.03); right: -10px; bottom: -20px; line-height: 1; pointer-events: none; user-select: none;
    }
  `;
  document.head.appendChild(style);
};

// ── Slot dot color ────────────────────────────────────────────────────────────
const getDotColor = (subject) => {
  if (!subject) return "#444";
  const s = subject.toLowerCase();
  if (s.includes("sleep")) return "#7C3AED";
  if (s.includes("break") || s.includes("lunch") || s.includes("dinner")) return "#D97706";
  if (s.includes("play") || s.includes("exercise")) return "#059669";
  return "#D4AF37";
};

// ── Main Component ────────────────────────────────────────────────────────────
const TimetablePage = () => {
  const [subjects, setSubjects] = useState("");
  const [days, setDays] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [level, setLevel] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs
  const rootRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRef = useRef(null);
  const ttSectionRef = useRef(null);
  const daysContainerRef = useRef(null);
  const historySectionRef = useRef(null);
  const historyContainerRef = useRef(null);

  useEffect(() => {
    injectStyles();

    // Entry animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }, "start")
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, "start+=0.15")
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "start+=0.35")
      .to(cardRef.current, { opacity: 1, y: 0, duration: 0.7 }, "start+=0.5");

    // Floating shimmer on card
    gsap.to(cardRef.current, {
      boxShadow: "0 0 40px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.6)",
      repeat: -1, yoyo: true, duration: 2.5, ease: "sine.inOut"
    });
  }, []);

  // Animate day cards when timetable changes
  useEffect(() => {
    if (!timetable.length) return;
    const cards = daysContainerRef.current?.querySelectorAll(".tt-day-card");
    if (!cards?.length) return;

    gsap.to(ttSectionRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)", delay: 0.1 }
    );
  }, [timetable]);

  // Animate history items
  useEffect(() => {
    if (!history.length) return;
    const items = historyContainerRef.current?.querySelectorAll(".tt-history-item");
    if (!items?.length) return;
    gsap.to(historySectionRef.current, { opacity: 1, duration: 0.4 });
    gsap.to(items, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.2 });
  }, [history]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!subjects || !days || !hoursPerDay || !level) { setError("Please fill all fields"); return; }

    // Button pulse
    gsap.fromTo(e.currentTarget.querySelector(".tt-btn"), { scale: 0.97 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });

    try {
      setLoading(true); setError("");
      const subjectArray = subjects.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await axios.post(
        `${backendUrl}/api/timetable/generate`,
        { subjects: subjectArray, days: Number(days), hoursPerDay: Number(hoursPerDay), level },
        { withCredentials: true }
      );
      setTimetable(res?.data?.timetable?.timetable || []);
      fetchHistory();
    } catch (err) {
      console.error("Generate Error:", err);
      setError("Failed to generate timetable");
      gsap.fromTo(cardRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/timetable/my-records`, { withCredentials: true });
      setHistory(res?.data?.timetables || []);
    } catch { setHistory([]); }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="tt-root" ref={rootRef} style={{ position: "relative" }}>
      <ParticleCanvas />

      {/* ── HERO ── */}
      <div className="tt-hero" style={{ position: "relative", zIndex: 1 }}>
        <div className="tt-badge" ref={badgeRef} style={{ transform: "translateY(20px)" }}>
           Tutor Connect
        </div>
        <h1 className="tt-title" ref={titleRef} style={{ transform: "translateY(30px)" }}>
          Timetable<br />Architect
        </h1>
        <p className="tt-subtitle" ref={subtitleRef} style={{ transform: "translateY(20px)" }}>
          Craft your schedule · Dominate every day
        </p>
      </div>

      {/* ── FORM CARD ── */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 24px" }}>
        <div className="tt-card" ref={cardRef} style={{ transform: "translateY(30px)" }}>
          <div className="tt-deco-num">✦</div>
          <div className="tt-card-title">Configure Your Plan</div>

          {error && <div className="tt-error">⚠ {error}</div>}

          <input
            type="text"
            placeholder="Subjects  —  Math, Physics, English…"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="tt-input"
          />

          <div className="tt-grid-2">
            <input
              type="number"
              placeholder="Days  (e.g. 5)"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="tt-input"
              style={{ marginBottom: 0 }}
            />
            <input
              type="number"
              placeholder="Hours / day  (e.g. 4)"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="tt-input"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ height: 16 }} />

          <select value={level} onChange={(e) => setLevel(e.target.value)} className="tt-select">
            <option value="">Select Level</option>
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="exam">Exam Preparation</option>
          </select>

          <button
            type="button"
            className="tt-btn"
            disabled={loading}
            onClick={handleGenerate}
          >
            {loading ? (
              <><div className="tt-spinner" /><span>Generating…</span></>
            ) : (
              <span>Generate Timetable</span>
            )}
          </button>
        </div>
      </div>

      {/* ── TIMETABLE RESULT ── */}
      {timetable.length > 0 && (
        <div ref={ttSectionRef} style={{ opacity: 0, position: "relative", zIndex: 1, marginTop: 60 }}>
          <div className="tt-section-title">Your Timetable</div>
          <div className="tt-days-grid" ref={daysContainerRef}>
            {timetable.map((day, idx) => (
              <div className="tt-day-card" key={idx}>
                <div className="tt-deco-num">{idx + 1}</div>
                <div className="tt-day-name">{day?.day}</div>
                {Array.isArray(day?.slots) && day.slots.map((slot, i) => (
                  <div className="tt-slot" key={i}>
                    <div className="tt-slot-dot" style={{ background: getDotColor(slot?.subject) }} />
                    <div>
                      <div className="tt-slot-time">{slot?.time}</div>
                      <div className="tt-slot-subject">{slot?.subject}</div>
                      {slot?.tutorRecommended && (
                        <span className="tt-slot-badge">Tutor Rec.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      {history.length > 0 && (
        <div ref={historySectionRef} style={{ opacity: 0, position: "relative", zIndex: 1 }}>
          <div className="tt-divider" />
          <div className="tt-section-title">Previous Schedules</div>
          <div className="tt-history-wrap" ref={historyContainerRef}>
            {history.map((item, idx) => (
              <div className="tt-history-item" key={idx}>
                <div className="tt-history-date">
                  ◆ &nbsp;Created — {new Date(item?.createdAt).toLocaleString()}
                </div>
                <div className="tt-history-grid">
                  {Array.isArray(item?.timetable) && item.timetable.map((day, i) => (
                    <div className="tt-history-day" key={i}>
                      <div className="tt-history-day-name">{day?.day}</div>
                      {day?.slots?.slice(0, 3).map((slot, j) => (
                        <div className="tt-history-slot" key={j}>
                          {slot?.time} — {slot?.subject}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 40 }} />
    </div>
  );
};

export default TimetablePage;
