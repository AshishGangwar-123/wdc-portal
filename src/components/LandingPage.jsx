import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Sparkles, Code2, Zap, Brain, Calendar,
  CheckCircle2, Terminal, Cpu, Layers, GitBranch,
  Users, Trophy, BookOpen, Rocket, Monitor, Database,
  ChevronRight, Star, Globe, Shield, Play, ExternalLink,
  BarChart2, Wifi, Lock, Heart, UserPlus, Mail
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LinkedInIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
import FloatingCodeElements from './FloatingCodeElements';
import AIConciergeWidget from './AIConciergeWidget';
import AuraFloatingAvatar from './AuraFloatingAvatar';
import MediaGalleryBox from './MediaGalleryBox';
import TeamDeck3D from './TeamDeck3D';

gsap.registerPlugin(ScrollTrigger);

// WDC Club Domains
const DOMAINS = [
  { icon: Brain,    label: 'Artificial Intelligence & ML', color: '#00f2fe',  desc: 'Explore ML, Deep Learning, NLP & GenAI with hands-on projects' },
  { icon: Globe,    label: 'Web Development',              color: '#7928ca',  desc: 'Full-stack development with React, Node.js, FastAPI & more' },
  { icon: BarChart2,label: 'Data Science',                 color: '#10b981',  desc: 'Data Analysis, Visualization, Pandas, NumPy & Jupyter' },
  { icon: Terminal, label: 'C / C++ Programming',          color: '#ff007a',  desc: 'Core programming concepts, DSA & competitive coding' },
  { icon: Database, label: 'Databases & Cloud',            color: '#f59e0b',  desc: 'SQL, MongoDB, Firebase & cloud deployment on AWS/GCP' },
  { icon: Cpu,      label: 'Emerging Technologies',        color: '#6366f1',  desc: 'Blockchain, IoT, Cybersecurity & open-source innovation' },
];

// Why Join WDC
const WHY_JOIN = [
  { icon: BookOpen,  title: 'Expert-Led Sessions',       desc: 'Learn directly from industry professionals, senior developers & university toppers through live workshops and interactive seminars.',        color: '#00f2fe' },
  { icon: Users,     title: 'Community & Mentorship',     desc: 'Join a thriving community of 200+ active tech enthusiasts at RECB. Get 1-on-1 guidance from senior members and industry mentors.',        color: '#7928ca' },
  { icon: Rocket,    title: 'Project-Based Learning',     desc: 'Build real-world projects for your portfolio. From ML models to full-stack apps — every session ends with something you can ship.',       color: '#10b981' },
  { icon: Globe,     title: 'Knowledge Sharing',          desc: 'Students teach students. Our peer-learning culture means everyone is both a learner and a teacher, accelerating growth exponentially.',     color: '#f59e0b' },
  { icon: Shield,    title: 'Career Acceleration',        desc: 'Resume workshops, mock interviews, LinkedIn profile reviews and referrals from alumni currently at top tech companies and startups.',       color: '#6366f1' },
];

// Marquee Tech Stack
const TECH_STACK = [
  'React.js','Python','FastAPI','TensorFlow','LangChain','Node.js','MongoDB',
  'MySQL','C / C++','Pandas','Scikit-learn','Docker','Git & GitHub','Jupyter',
  'Next.js','OpenAI API','GSAP','Tailwind CSS','Firebase','AWS',
];

export default function LandingPage({ isSiteLoaded, onLaunchAI }) {
  const heroTitleRef    = useRef(null);
  const heroBadgeRef    = useRef(null);
  const heroRightRef    = useRef(null);
  const domainsRef      = useRef(null);
  const whyJoinRef      = useRef(null);
  const marqueeRef      = useRef(null);
  const ctaRef          = useRef(null);

  const [dbWorkshops, setDbWorkshops] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch live workshops from backend DB (relative URL — works both local & deployed)
  useEffect(() => {
    fetch('/api/workshops')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDbWorkshops(data);
      })
      .catch(() => {});
  }, []);

  const [typedText, setTypedText] = useState('');
  const phrases = ['AI / ML Workshops','Web Dev Sessions','Data Science Deep Dives','Hackathon Prep','C Programming Bootcamps'];
  const phraseIdx = useRef(0);
  const charIdx   = useRef(0);
  const deleting  = useRef(false);

  // Typewriter effect
  useEffect(() => {
    const tick = () => {
      const phrase = phrases[phraseIdx.current];
      if (!deleting.current) {
        setTypedText(phrase.slice(0, charIdx.current + 1));
        charIdx.current++;
        if (charIdx.current === phrase.length) {
          deleting.current = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        setTypedText(phrase.slice(0, charIdx.current - 1));
        charIdx.current--;
        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting.current ? 50 : 80);
    };
    const t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  // GSAP Master Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ─── HERO ENTRANCE ────────────────────────────────────────────
      const heroTL = gsap.timeline({ delay: 0.1 });
      heroTL
        .fromTo(heroBadgeRef.current,
          { scale: 0.6, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' }
        )
        .fromTo(heroTitleRef.current.querySelectorAll('.hero-line'),
          { y: 80, opacity: 0, rotateX: -25, skewY: 3 },
          { y: 0, opacity: 1, rotateX: 0, skewY: 0, duration: 1, stagger: 0.12, ease: 'power4.out' },
          '-=0.5'
        )
        .fromTo(heroTitleRef.current.querySelector('.hero-sub'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(heroTitleRef.current.querySelector('.hero-btns'),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(heroRightRef.current,
          { scale: 0.88, opacity: 0, x: 50 },
          { scale: 1, opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' },
          '-=0.7'
        );

      // ─── FLOATING BADGE CONTINUOUS ANIMATION ─────────────────────
      gsap.to(heroRightRef.current, {
        y: -12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1,
      });

      // ─── TECH STACK PILLS (staggered entrance) ────────────────────
      gsap.fromTo('.tech-pill-hero',
        { scale: 0, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(1.5)', delay: 1.5 }
      );



      // ─── MARQUEE SECTION ─────────────────────────────────────────
      ScrollTrigger.create({
        trigger: marqueeRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(marqueeRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // ─── DOMAINS SECTION STAGGER ─────────────────────────────────
      ScrollTrigger.create({
        trigger: domainsRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo('.domain-card',
            { y: 60, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // ─── WHY JOIN CARDS ───────────────────────────────────────────
      ScrollTrigger.create({
        trigger: whyJoinRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo('.why-card',
            { y: 50, opacity: 0, rotateY: -15 },
            { y: 0, opacity: 1, rotateY: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      // ─── SECTION HEADINGS SPLIT REVEAL ───────────────────────────
      gsap.utils.toArray('.section-heading-reveal').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(el,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
            );
          },
          once: true,
        });
      });

      // ─── CTA SECTION ─────────────────────────────────────────────
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(ctaRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' }
          );
        },
        once: true,
      });

      // ─── DOMAIN CARD HOVER TILT ───────────────────────────────────
      document.querySelectorAll('.domain-card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -10, scale: 1.04, duration: 0.3, ease: 'power2.out',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      });

      // ─── WHY JOIN CARD HOVER ─────────────────────────────────────
      document.querySelectorAll('.why-card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '135px', paddingBottom: '0px', background: 'var(--bg-dark)', overflow: 'hidden' }}>

      {/* Rich Background System */}
      <FloatingCodeElements />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />
      <div className="bg-grid" />
      <div className="bg-dots" />
      <div className="bg-noise" />

      {/* Main Content Body */}
      <main style={{ flex: '1 0 auto', width: '100%' }}>

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section
        id="hero"
        className="hero-grid"
        style={{
          maxWidth: '1350px', margin: '0 auto', padding: '24px 24px 0 24px',
          display: 'grid', gridTemplateColumns: '1fr 1.25fr',
          gap: '36px', alignItems: 'flex-start',
          minHeight: 'calc(100vh - 180px)', position: 'relative', zIndex: 2,
        }}
      >
        {/* Left Column */}
        <div ref={heroTitleRef} style={{ perspective: '1000px' }}>

          {/* Club Badge */}
          <div ref={heroBadgeRef} style={{ marginBottom: '28px' }}>
            <div
              className="float-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 22px',
                borderRadius: '99px',
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(121, 40, 202, 0.18) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                boxShadow: '0 8px 30px rgba(0, 242, 254, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00f2fe', boxShadow: '0 0 12px #00f2fe', display: 'inline-block' }} />
              <span
                style={{
                  fontFamily: 'Outfit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: '#f0f4ff',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Web Development Club
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1
            className="hero-line"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.6rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.06, marginBottom: '6px' }}
          >
            Where Engineers
          </h1>
          <h1
            className="hero-line"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.6rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.06, marginBottom: '6px' }}
          >
            <span className="text-gradient">Build, Learn</span>
          </h1>
          <h1
            className="hero-line"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.6rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.06, marginBottom: '24px' }}
          >
            & <span className="text-gradient-pink">Grow Together</span>
          </h1>

          {/* Typewriter subtitle (Pre-allocated reserved height so layout never shifts) */}
          <div
            className="hero-sub"
            style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#94a3b8', minHeight: '3.6em', lineHeight: 1.5, display: 'block' }}
          >
            The official tech club of RECB Banda, conducting expert-led{' '}
            <span style={{ color: '#00f2fe', fontWeight: 700, display: 'inline' }}>
              {typedText}<span className="type-cursor" />
            </span>
          </div>

          <p
            className="hero-sub"
            style={{ fontSize: '1rem', color: '#64748b', lineHeight: 1.7, maxWidth: '520px', marginBottom: '36px' }}
          >
            Join 200+ active students from Rajkiya Engineering College Banda as we explore AI/ML, 
            Web Development, Data Science, competitive programming and emerging technologies 
            through hands-on workshops, hackathons and peer knowledge sharing.
          </p>

          {/* Action Buttons */}
          <div className="hero-btns" style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a
              href="#workshops"
              className="glass-btn glass-btn-primary"
              style={{
                padding: '16px 36px',
                fontSize: '1.05rem',
                gap: '12px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
                border: '1px solid rgba(0, 242, 254, 0.5)',
                boxShadow: '0 10px 30px rgba(0, 242, 254, 0.35)',
                color: '#fff',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <Calendar size={20} color="#fff" />
              <span>Upcoming Workshops</span>
              <ArrowRight size={18} color="#fff" />
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { icon: '🏛️', text: 'RECB Banda', sub: 'Official Club' },
              { icon: '👨‍💻', text: '200+ Active', sub: 'Club Members' },
              { icon: '🏆', text: '15+ Events', sub: 'Per Semester' },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 18px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0f4ff' }}>{b.text}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'Fira Code' }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div style={{ marginTop: '32px' }}>
            <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'Fira Code', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Technologies We Cover
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Web Development', 'DSA', 'React.js', 'Python', 'TensorFlow', 'FastAPI', 'C/C++', 'SQL', 'LangChain', 'Docker'].map((t) => (
                <span key={t} className="tech-pill tech-pill-hero" style={{ fontSize: '0.76rem' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — AI Concierge Widget & GSAP Animated Media Showcase */}
        <div id="ai-concierge" ref={heroRightRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", paddingTop: "16px", width: "100%" }}>
          {/* Decorative glow behind widget */}
          <div style={{
            position: 'absolute', inset: '-40px',
            background: 'radial-gradient(ellipse at center, rgba(0,242,254,0.12) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <AuraFloatingAvatar isSiteLoaded={isSiteLoaded} onOpenChat={() => setIsChatOpen(true)} />
          <AIConciergeWidget isSiteLoaded={isSiteLoaded} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <MediaGalleryBox />
        </div>
      </section>



      {/* ================================================================
          TECH STACK MARQUEE
          ================================================================ */}
      <div ref={marqueeRef} style={{ margin: '80px 0', overflow: 'hidden', position: 'relative', zIndex: 2, opacity: 0 }}>
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'Fira Code', fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            What We Learn — Our Tech Arsenal
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          {/* Fade masks */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, var(--bg-dark), transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to left, var(--bg-dark), transparent)', zIndex: 1, pointerEvents: 'none' }} />
          <div className="marquee-track" style={{ gap: '16px', paddingLeft: '16px' }}>
            {[...TECH_STACK, ...TECH_STACK].map((t, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0, padding: '10px 22px', borderRadius: '99px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  fontFamily: 'Fira Code', fontSize: '0.82rem', color: '#94a3b8',
                  whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f2fe', opacity: 0.8 }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
          DOMAINS — WHAT WE DO
          ================================================================ */}
      <section
        id="domains"
        ref={domainsRef}
        style={{ maxWidth: '1300px', margin: '60px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}
      >
        <div className="section-heading-reveal" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-tag" style={{ marginBottom: '14px' }}>🎯 Club Domains</div>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '12px' }}>
            What We <span className="text-gradient-animated">Explore at WDC</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
            From artificial intelligence to core programming — our club covers the full spectrum 
            of technologies that matter in today's industry.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '24px' }}>
          {DOMAINS.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <div
                key={i}
                className="domain-card glass-panel"
                style={{
                  padding: '32px',
                  border: `1px solid ${domain.color}20`,
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: 0,
                }}
              >
                {/* Background glow */}
                <div style={{
                  position: 'absolute', top: '-30px', right: '-30px',
                  width: '120px', height: '120px',
                  borderRadius: '50%', background: `${domain.color}12`,
                  filter: 'blur(30px)', pointerEvents: 'none',
                }} />

                <div
                  style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: `${domain.color}15`, border: `1px solid ${domain.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: domain.color, marginBottom: '20px',
                    boxShadow: `0 0 20px ${domain.color}25`,
                  }}
                >
                  <Icon size={26} />
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '10px', color: '#f0f4ff' }}>
                  {domain.label}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {domain.desc}
                </p>

                {/* Bottom accent line */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '2px', background: `linear-gradient(90deg, transparent, ${domain.color}, transparent)`,
                  opacity: 0.6,
                }} />
              </div>
            );
          })}
        </div>
      </section>



      {/* ================================================================
          WHY JOIN WDC
          ================================================================ */}
      <section
        id="why-join"
        ref={whyJoinRef}
        style={{ maxWidth: '1300px', margin: '120px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}
      >
        <div className="section-heading-reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-tag" style={{ marginBottom: '14px' }}>🌟 Why Join WDC?</div>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '12px' }}>
            More Than Just <span className="text-gradient-cyan">a Club</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            WDC is a launchpad for your engineering career. Here's what you get when you become a member.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {WHY_JOIN.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="why-card glass-panel"
                style={{ padding: '32px', cursor: 'default', opacity: 0 }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${item.color}15`, border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0,
                  }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f0f4ff' }}>{item.title}</h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          UPCOMING WORKSHOP SHOWCASE
          ================================================================ */}
      <section
        id="workshops"
        style={{ maxWidth: '1300px', margin: '120px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}
      >
        <div
          className="glass-panel workshop-showcase-panel section-heading-reveal"
          style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.06) 0%, rgba(121,40,202,0.08) 50%, rgba(255,0,122,0.04) 100%)',
            border: '1px solid rgba(0,242,254,0.15)',
          }}
        >
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(0,242,254,0.06)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(121,40,202,0.08)', filter: 'blur(50px)' }} />

          {dbWorkshops.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <div className="section-tag" style={{ marginBottom: '16px', display: 'inline-flex' }}>
                📅 WORKSHOP SCHEDULE
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                No Active Workshops Scheduled Right Now
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '500px', margin: '0 auto 24px' }}>
                New workshops will be announced here soon. Subscribe below to get notified when seats open!
              </p>
            </div>
          ) : (
            <div className="workshop-showcase-grid" style={{ position: 'relative', zIndex: 1 }}>
              {(() => {
                const featured = dbWorkshops[0];
                const title = featured.title;
                const mentor = featured.mentor || 'WDC Lead Mentor';
                const date = featured.date || 'Scheduled';
                const time = featured.time || '18:00 IST';
                const topics = Array.isArray(featured.topics) && featured.topics.length > 0 
                  ? featured.topics.join(', ') 
                  : 'Full-Stack Development';

                return (
                  <div>
                    <div className="section-tag" style={{ marginBottom: '18px' }}>
                      🔥 UPCOMING MASTERCLASS
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '16px', lineHeight: 1.2, color: '#fff' }}>
                      {title}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
                      A hands-on, project-based masterclass covering {topics}. Conducted by {mentor}.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                      {[
                        `🗓️  ${date}  •  ${time}`,
                        '📍  Rajkiya Engineering College, Banda (RECB)',
                        `🎓  Mentor: ${mentor}`,
                        '🏅  Certificate of Completion + Source Code Kit',
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '0.92rem' }}>
                          <CheckCircle2 size={16} color="#00f2fe" style={{ flexShrink: 0 }} />
                          {item}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={onLaunchAI}
                      className="glass-btn glass-btn-primary"
                      style={{ padding: '14px 32px', fontSize: '1rem' }}
                    >
                      Register via AI Concierge <ArrowRight size={18} />
                    </button>
                  </div>
                );
              })()}

              {/* Dynamic seat availability cards from DB strictly */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dbWorkshops.slice(0, 4).map((ws, i) => {
                  const total = ws.seats || 50;
                  const enrolled = ws.enrolled || 0;
                  const color = ws.color || (i === 0 ? '#00f2fe' : i === 1 ? '#7928ca' : i === 2 ? '#10b981' : '#ff007a');
                  const left = total - enrolled;
                  const pct = Math.round((enrolled / total) * 100);

                  return (
                    <div key={ws.id || i} className="glass-panel" style={{ padding: '16px 20px', border: `1px solid ${color}25` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>{ws.title}</span>
                        <span style={{ fontFamily: 'Fira Code', fontSize: '0.78rem', color: color }}>
                          {left > 0 ? `${left} left` : 'Full'}
                        </span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{enrolled}/{total} enrolled</span>
                        <span style={{ fontSize: '0.72rem', color: color, fontWeight: 700 }}>
                          {pct}% full
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          3D PLAYING CARDS TEAM DECK SHOWCASE ("TAAS DECK")
          ================================================================ */}
      <TeamDeck3D />

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section
        ref={ctaRef}
        style={{ maxWidth: '900px', margin: '120px auto 0', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center', opacity: 0 }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '72px 48px', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(121,40,202,0.12) 0%, rgba(0,242,254,0.08) 100%)',
            border: '1px solid rgba(0,242,254,0.18)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-glow)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-tag" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              🚀 Ready to Level Up?
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '18px', lineHeight: 1.1 }}>
              Be Part of WDC —<br />
              <span className="text-gradient-animated">RECB Banda's Tech Community</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
              Whether you're a first-year student curious about coding or a final-year developer 
              looking to give back — there's a place for you in Web Development Club.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onLaunchAI}
                className="glass-btn glass-btn-primary"
                style={{ padding: '16px 40px', fontSize: '1.05rem' }}
              >
                <Sparkles size={20} /> Talk to Our AI Concierge
              </button>
              <button
                onClick={() => {
                  const el = document.querySelector('#domains');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-btn"
                style={{
                  padding: '16px 36px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '16px',
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  color: '#00f2fe',
                  boxShadow: '0 8px 25px rgba(0, 242, 254, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <BookOpen size={20} color="#00f2fe" />
                <span>Explore Club Domains</span>
                <ChevronRight size={18} color="#00f2fe" />
              </button>
            </div>

            {/* Social proof row */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['🧑‍💻 Students from all branches welcome','🌐 Hybrid sessions — online & offline','📜 Certificates for every workshop'].map((t, i) => (
                <span key={i} style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} color="#10b981" />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer (Static, Non-Animated & Firmly Anchored) */}
      <footer style={{ width: '100%', maxWidth: '1300px', margin: '20px auto 0', padding: '24px 24px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10, boxSizing: 'border-box', transform: 'none', animation: 'none', transition: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Column 1: Brand & About */}
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>
              WDC <span style={{ color: '#00f2fe' }}>·</span> Web Development Club
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
              The official tech club of Rajkiya Engineering College Banda (RECB), Uttar Pradesh. Conducting expert-led workshops in AI/ML, Web Dev & Data Science.
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Fira Code', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              Active Live Portal
            </div>
          </div>

          {/* Column 2: Quick Navigation (Navbar links except login) */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontFamily: 'Outfit', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#00f2fe'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#domains')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontFamily: 'Outfit', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#00f2fe'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Club Domains
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#workshops')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontFamily: 'Outfit', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#00f2fe'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  Upcoming Workshops
                </button>
              </li>
              <li>
                <button
                  onClick={onLaunchAI}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontFamily: 'Outfit', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#00f2fe'}
                  onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                >
                  AI Concierge Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Domains */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Specialized Domains
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <li>🤖 Artificial Intelligence & ML</li>
              <li>🌐 Full-Stack Web Development</li>
              <li>📊 Data Science & Analytics</li>
              <li>⚡ C / C++ & Competitive Coding</li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus & Contact
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>📍 Rajkiya Engineering College Banda, UP</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '0.82rem' }}>
                <Mail size={15} color="#00f2fe" />
                <a href="mailto:wdcrecb@gmail.com" style={{ color: '#00f2fe', textDecoration: 'none' }}>wdcrecb@gmail.com</a>
              </div>

              <div style={{ marginTop: '4px' }}>
                <a
                  href="https://www.linkedin.com/company/web-dev-club-recb/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    color: '#0077b5',
                    borderColor: 'rgba(0, 119, 181, 0.4)',
                    background: 'rgba(0, 119, 181, 0.12)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <LinkedInIcon size={14} color="#0077b5" />
                  Connect on LinkedIn <ExternalLink size={12} color="#0077b5" />
                </a>
              </div>

              <div style={{ marginTop: '4px', color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>👥 200+ Active Student Members</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            © 2026 Web Development Club. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
            Built with <Heart size={13} color="#ff007a" style={{ margin: '0 4px' }} /> by WDC Members · Rajkiya Engineering College Banda
          </div>
        </div>
      </footer>
    </div>
  );
}
