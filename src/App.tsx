import { useEffect, useRef, useState, type CSSProperties } from 'react';

const NAME = 'Arch Angelo Nino Coles';
const ROLE = 'Software Engineer';
const IDS = ['about', 'skills', 'projects', 'education', 'contact'] as const;
type SectionId = (typeof IDS)[number];

const SKILLS: { name: string; ext: string }[] = [
  { name: 'React', ext: '.jsx' },
  { name: 'TypeScript', ext: '.ts' },
  { name: 'PostgreSQL', ext: '.sql' },
  { name: 'HTML', ext: '.html' },
  { name: 'CSS', ext: '.css' },
  { name: 'JavaScript', ext: '.js' },
  { name: 'C', ext: '.c' },
];

export default function App() {
  const [n, setN] = useState(0);
  const [r, setR] = useState(0);
  const [blink, setBlink] = useState(true);
  const [mouse, setMouse] = useState({ x: 30, y: 30 });
  const [active, setActive] = useState<SectionId>('about');
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const [proj, setProj] = useState(false);
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  const refs = useRef<Record<SectionId, HTMLElement | null>>({
    about: null,
    skills: null,
    projects: null,
    education: null,
    contact: null,
  });

  // typing: name first, then role
  useEffect(() => {
    const t = setInterval(() => {
      setN(prevN => {
        if (prevN < NAME.length) return prevN + 1;
        return prevN;
      });
    }, 65);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (n < NAME.length) return;
    const t = setInterval(() => {
      setR(prevR => {
        if (prevR >= ROLE.length) {
          clearInterval(t);
          return prevR;
        }
        return prevR + 1;
      });
    }, 65);
    return () => clearInterval(t);
  }, [n]);

  // blink
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  // width
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // scroll spy + reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          const id = (e.target as HTMLElement).dataset.sec;
          if (id && e.isIntersecting) setSeen(s => ({ ...s, [id]: true }));
        });
      },
      { threshold: 0.12 }
    );

    const onScroll = () => {
      let next: SectionId = IDS[0];
      IDS.forEach(id => {
        const el = refs.current[id];
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) next = id;
      });
      setActive(prev => (prev !== next ? next : prev));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const sync = () => {
      setSeen(s => {
        const next = { ...s };
        IDS.forEach(id => {
          const el = refs.current[id];
          if (el && el.getBoundingClientRect().top < window.innerHeight) next[id] = true;
        });
        return next;
      });
      setW(window.innerWidth);
      onScroll();
    };

    const ro = new ResizeObserver(() => sync());
    ro.observe(document.documentElement);

    const raf = requestAnimationFrame(sync);
    const to = setTimeout(sync, 300);

    IDS.forEach(id => {
      const el = refs.current[id];
      if (el) io.observe(el);
    });

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(to);
    };
  }, []);

  const wide = w >= 900;
  const typingName = n < NAME.length;
  const typingRole = !typingName && r < ROLE.length;
  const cur = (on: boolean): CSSProperties => ({ color: 'var(--color-accent)', opacity: on ? 1 : 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  };

  const secStyle = (id: SectionId): CSSProperties => ({
    padding: wide ? 'var(--space-8) 0 calc(var(--space-8) * 3)' : 'var(--space-8) 0',
    scrollMarginTop: '40px',
    opacity: seen[id] ? 1 : 0,
    transform: seen[id] ? 'translateY(0)' : 'translateY(28px)',
    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(.2,.7,.2,1)',
  });

  const scrollToSection = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = refs.current[id];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
  };

  const ioCols = w >= 560 ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)';

  return (
    <div
      style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', position: 'relative', minHeight: '100vh' }}
      onMouseMove={onMouseMove}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(560px circle at ${mouse.x}% ${mouse.y}%, color-mix(in srgb, var(--color-accent) 11%, transparent), transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.35,
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--color-text) 5%, transparent) 1px, transparent 1px),linear-gradient(90deg, color-mix(in srgb, var(--color-text) 5%, transparent) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: wide ? 'minmax(0,5fr) minmax(0,7fr)' : 'minmax(0,1fr)',
          gap: wide ? 'calc(var(--space-8) * 2.5)' : 0,
          padding: wide ? '0 calc(var(--space-8) * 2)' : '0 var(--space-6)',
        }}
      >
        <aside
          style={{
            position: wide ? 'sticky' : 'relative',
            top: 0,
            alignSelf: 'start',
            height: wide ? '100vh' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 'var(--space-6)',
            padding: wide ? 'clamp(24px, 8vh, 67px) 0' : 'calc(var(--space-8) * 2) 0 var(--space-8)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-neutral-500)', letterSpacing: '0.04em' }}>
              ~/portfolio &middot; v2.0
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(36px,4.4vw,58px)', lineHeight: 1.04, letterSpacing: '-0.03em', margin: '0 0 var(--space-4)' }}>
                {NAME.slice(0, n)}
                <span style={cur(typingName)}>_</span>
              </h1>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--color-accent-300)', minHeight: '1.5em' }}>
                <span style={{ color: 'var(--color-neutral-500)' }}>&gt; </span>
                {ROLE.slice(0, r)}
                <span style={cur(!typingName && (typingRole || blink))}>_</span>
              </div>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--color-neutral-300)', fontSize: '15px', margin: 0, textWrap: 'pretty' as CSSProperties['textWrap'] }}>
              Passionate to make systems that truly produces solutions to businesses and individuals
            </p>
          </div>

          <nav style={{ display: wide ? 'flex' : 'none', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {IDS.map((id, i) => {
              const on = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={scrollToSection(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    color: on ? 'var(--color-text)' : 'var(--color-neutral-500)',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = on ? 'var(--color-text)' : 'var(--color-neutral-500)')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>0{i + 1}</span>
                  <span
                    style={{
                      height: '1px',
                      width: on ? '56px' : '24px',
                      background: on ? 'var(--color-accent)' : 'var(--color-neutral-700)',
                      transition: 'width .3s ease, background .3s',
                    }}
                  />
                  <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
                </a>
              );
            })}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="mailto:colesarch48@gmail.com">
                Email me
              </a>
              <a className="btn btn-secondary" href="https://github.com/ArchNapixel" target="_blank" rel="noopener">
                GitHub
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-neutral-500)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent)' }} />
              <span>open to opportunities</span>
            </div>
          </div>
        </aside>

        <main style={{ paddingTop: wide ? 'calc(var(--space-8) * 2)' : 0 }}>
          <section
            id="about"
            data-sec="about"
            ref={el => (refs.current.about = el)}
            style={secStyle('about')}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
              01 / about
            </div>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--color-divider)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-neutral-700)' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-neutral-700)' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-neutral-700)' }} />
                <span style={{ marginLeft: 'var(--space-3)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                  arch@portfolio: ~
                </span>
              </div>
              <div style={{ padding: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.9, color: 'var(--color-neutral-300)' }}>
                <div>
                  <span style={{ color: 'var(--color-accent)' }}>$</span> whoami
                </div>
                <div style={{ color: 'var(--color-text)' }}>Arch Angelo Nino Coles</div>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>$</span> cat role.txt
                </div>
                <div style={{ color: 'var(--color-text)' }}>Software Engineer</div>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>$</span> cat school.txt
                </div>
                <div style={{ color: 'var(--color-text)' }}>Information Systems &middot; Ateneo de Davao University</div>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>$</span> ls ./projects
                </div>
                <div style={{ color: 'var(--color-text)' }}>anihanos/</div>
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>$</span> <span style={cur(blink)}>&#9612;</span>
                </div>
              </div>
            </div>
          </section>

          <section
            id="skills"
            data-sec="skills"
            ref={el => (refs.current.skills = el)}
            style={secStyle('skills')}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
              02 / skills
            </div>
            <h2 style={{ margin: '0 0 var(--space-6)' }}>Stack</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 'var(--space-3)' }}>
              {SKILLS.map((s, i) => (
                <div
                  key={s.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-divider)',
                    background: 'color-mix(in srgb, var(--color-surface) 70%, transparent)',
                    cursor: 'default',
                    opacity: seen.skills ? 1 : 0,
                    transform: seen.skills ? 'none' : 'translateY(12px)',
                    transition: `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s, border-color .2s, background .2s`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.background = 'var(--color-accent-900)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-divider)';
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--color-surface) 70%, transparent)';
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-neutral-500)' }}>{s.ext}</span>
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{s.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            id="projects"
            data-sec="projects"
            ref={el => (refs.current.projects = el)}
            style={secStyle('projects')}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
              03 / projects
            </div>
            <h2 style={{ margin: '0 0 var(--space-6)' }}>Selected work</h2>
            <a
              href="https://github.com/ArchNapixel"
              target="_blank"
              rel="noopener"
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'var(--color-text)',
                padding: 'var(--space-8)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                boxShadow: proj ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                transform: proj ? 'translateY(-4px)' : 'none',
                transition: 'transform .3s ease, box-shadow .3s ease',
              }}
              onMouseEnter={() => setProj(true)}
              onMouseLeave={() => setProj(false)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)' }}>
                    P-001 &middot; Full-stack developer
                  </div>
                  <h3 style={{ fontSize: 34, margin: 0, letterSpacing: '-0.02em' }}>AnihanOS</h3>
                </div>
                <span style={{ fontSize: 26, color: 'var(--color-accent)', transform: proj ? 'translate(3px,-3px)' : 'none', transition: 'transform .3s ease' }}>
                  &#8599;
                </span>
              </div>
              <p style={{ margin: 'var(--space-4) 0 var(--space-6)', color: 'var(--color-neutral-300)', fontSize: 15, maxWidth: 560, textWrap: 'pretty' as CSSProperties['textWrap'] }}>
                A sugarcane-specific farmer monitoring system. Weather-integrated forecasting of possible yield and growth, incorporating fertilizer and weather factors.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: ioCols, gap: 1, background: 'var(--color-divider)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-neutral-500)', letterSpacing: '0.06em' }}>INPUT</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>Weather data</div>
                </div>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-neutral-500)', letterSpacing: '0.06em' }}>INPUT</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>Fertilizer factors</div>
                </div>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-accent)', letterSpacing: '0.06em' }}>OUTPUT</div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>Yield &amp; growth forecast</div>
                </div>
              </div>
            </a>
          </section>

          <section
            id="education"
            data-sec="education"
            ref={el => (refs.current.education = el)}
            style={secStyle('education')}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
              04 / education
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: 'var(--space-6)', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-neutral-500)' }}>Year 3 &middot; now</div>
              <div>
                <h3 style={{ margin: '0 0 var(--space-1)' }}>Information Systems</h3>
                <div style={{ color: 'var(--color-neutral-300)' }}>Ateneo de Davao University</div>
              </div>
            </div>
          </section>

          <section
            id="contact"
            data-sec="contact"
            ref={el => (refs.current.contact = el)}
            style={secStyle('contact')}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>
              05 / contact
            </div>
            <h2 style={{ fontSize: 'clamp(28px,3.4vw,44px)', margin: '0 0 var(--space-6)', maxWidth: 520, letterSpacing: '-0.025em' }}>
              Have a system that needs building?
            </h2>
            <a
              href="mailto:colesarch48@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: 'clamp(18px,2.2vw,26px)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-accent)',
                paddingBottom: 4,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-300)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
            >
              colesarch48@gmail.com <span style={{ color: 'var(--color-accent)' }}>&#8594;</span>
            </a>
            <div
              style={{
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-4)',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-neutral-500)',
                background:
                  'linear-gradient(to right,transparent,var(--color-divider) 48px,var(--color-divider) calc(100% - 48px),transparent) no-repeat top / 100% 1px',
              }}
            >
              <span>&copy; 2026 Arch Angelo Nino Coles</span>
              <a
                href="https://github.com/ArchNapixel"
                target="_blank"
                rel="noopener"
                style={{ color: 'var(--color-neutral-500)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-neutral-500)')}
              >
                github.com/ArchNapixel
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
