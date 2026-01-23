"use client";

import { useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils/client/cn";


export default function About() {
  const ref = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);
  const [welcomeDone, setWelcomeDone] = useState(false);
  

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
    
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
    
      // progress starts when the section's top hits 80% of viewport
      // progress ends when the section's bottom hits 20% of viewport
      const start = vh * 0.8;
      const end = vh * 0.2;
    
      const raw = (start - r.top) / (start - end);
      setP(clamp01(raw));
    };
    

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref as any} id="section2" className="relative -mt-[10px] z-10">
      <CheckerBackgroundStraight progress={p} sectionRef={ref} />

      <div className="pointer-events-none absolute inset-0" />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center px-6 py-16 md:px-10",
          "min-h-[70vh] sm:min-h-[85vh] lg:min-h-screen"
        )}
      >
        <WelcomeBanner progress={p} onDone={() => setWelcomeDone(true)} />

        <RoadRevealBanner progress={p} canRun={welcomeDone} />

        <InfoHub progress={p} />

        {/* tracks and stick */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <RaceTrackTile
            label="BEGINNER"
            title="Beginner Track"
            body="Best for first-time hackers & new teams."
            variant="oval"

          />
          <RaceTrackTile
            label="INTERMEDIATE"
            title="Intermediate Track"
            body="More build depth, polish, and features."
            variant="chicane"

          />
          <RaceTrackTile
            label="F1 THEME"
            title="F1 Theme Track"
            body="Race-inspired builds, UI, data, sims, etc."
            variant="figure8"

          />
          <RaceTrackTile
            label="BEST PITCH"
            title="Best Pitch Track"
            body="Win the room with your demo + story."
            variant="hairpin"

          />
        </div>

            </div>
          </section>
        );
      }

function InfoHub({ progress }: { progress: number }) {
  const baseDelay = 0.34;

  return (
    <section className="mt-12">
  <div className="relative">
    {/* helmet sticker */}
    <img
      src="/img/logo/helmet.png"
      alt="Helmet"
      className="pointer-events-none absolute -top-8 right-6 z-20 w-28 rotate-[10deg] drop-shadow-[0_18px_26px_rgba(0,0,0,0.45)] md:-top-10 md:right-10 md:w-36"
    />
      
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/90 shadow-[0_28px_70px_rgba(0,0,0,0.55)]">

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/40" />

        {/* red top edge glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-red-600/20 to-transparent" />

        <RaceDecor />

        <div className="relative z-10 grid gap-6 p-6 md:grid-cols-12 md:p-8">

          <div className="grid gap-6 md:col-span-12">
            {/* location box */}
            <RevealCard progress={progress} delay={baseDelay + 0.06}>
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl shadow-black/30 md:p-7">
                <div className="grid gap-6 md:grid-cols-[1fr_320px] md:items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-red-100">
                      LOCATION
                      <span className="h-1 w-1 rounded-full bg-red-300" />
                    </div>

                    <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                      UTSA Buisness Building 
                    </h3>

                    <div className="mt-2 text-base font-normal text-white/70">
                      John Peace Library, 1 UTSA Circle, San Antonio, TX 78249
                    </div>

                    <a
                      className="mt-4 inline-block text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
                      href="#"
                    >
                      View Building Map
                    </a>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-sm">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3469.6320670992714!2d-98.61775519999999!3d29.5853069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c666230c713cd%3A0xd8ab925854c29366!2sBusiness%20Building!5e0!3m2!1sen!2sus!4v1769113657805!5m2!1sen!2sus"
                      className="h-[170px] w-full md:h-[210px]"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </RevealCard>

            {/* Bottom row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* parking info here needs to be updaed */}
              <RevealCard progress={progress} delay={baseDelay + 0.12}>
                <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl shadow-black/30 md:p-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-red-100">
                    PARKING
                    <span className="h-1 w-1 rounded-full bg-red-300" />
                  </div>

                  <div className="mt-4 text-base font-normal leading-relaxed text-white/75">
                    Parking will be available at{" "}
                    <a className="font-medium text-white underline underline-offset-4" href="#">
                      Lot 00
                    </a>{" "}
                    and{" "}
                    <a className="font-medium text-white underline underline-offset-4" href="#">
                      Lot 00
                    </a>
                    .
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/70">
                    <span className="font-medium text-white/85">Note:</span> Something about parking here
                  </div>
                </div>
              </RevealCard>

              <RevealCard progress={progress} delay={baseDelay + 0.18}>
                <div className="relative h-full overflow-hidden rounded-3xl bg-red-600 p-6 shadow-xl shadow-black/30 md:p-7">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

                  <div className="relative z-10">
                    <div className="text-[11px] font-semibold tracking-[0.18em] text-white/90">
                      NEED HELP?
                    </div>

                    <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      Questions on where to go?
                    </div>

                    <div className="mt-3 text-sm font-normal leading-relaxed text-white/90">
                      Follow the map link above or ask a mentor at check-in, and we’ll get you hacking in no time!
                    </div>

                    <a
                      href="https://maps.app.goo.gl/muyexi5FRwuVBa7o7"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
                    >
                      Get directions <span className="text-white/80">→</span>
                    </a>
                  </div>
                </div>
              </RevealCard>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

function RevealCard({
  progress,
  delay,
  className,
  children,
}: {
  progress: number;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  const t = clamp01((progress - delay) / 0.5);
  const o = easeOut(t, 0, 1);

  return (
    <div
      className={cn(className)}
      style={{
        opacity: o,
        transform: `translate3d(0, ${(1 - o) * 14}px, 0)`,
        filter: `blur(${(1 - o) * 0.6}px)`,
      }}
    >
      {children}
    </div>
  );
}

function RaceDecor() {
  return (
    <>
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-red-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-red-500/15 blur-2xl" />

      <div className="pointer-events-none absolute inset-x-0 top-[76px] h-px bg-white/10" />
    </>
  );
}

const checkeredStripStyleOnRed: React.CSSProperties = {
  backgroundSize: "18px 18px",
  backgroundImage:
    "linear-gradient(45deg, rgba(255,255,255,0.9) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0.9))," +
    "linear-gradient(45deg, rgba(0,0,0,0.35) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.35))",
  backgroundPosition: "0 0, 9px 9px",
};

function CheckerBackgroundStraight({
  progress,
  sectionRef,
}: {
  progress: number;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const tile = 100; // this is fixed size
  const fastTiles = 24;

  const [grid, setGrid] = useState({ cols: 18, rows: 10 });

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      const rect = el?.getBoundingClientRect();
      const w = rect?.width ?? window.innerWidth;
      const h = rect?.height ?? window.innerHeight;

      const pad = 6;
      const vw = window.innerWidth;

      const extraRows = vw >= 1536 ? 10 : vw >= 1280 ? 6 : 0;

      setGrid({
        cols: Math.ceil(w / tile) + pad,
        rows: Math.ceil(h / tile) + pad + extraRows,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  const total = grid.cols * grid.rows;

  const heroOverlap = 90; 

  const topFade = 140; 

  const bottomFadeStart = 78; 

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        top: -heroOverlap,
        height: `calc(100% + ${heroOverlap}px)`,
        WebkitMaskImage: `linear-gradient(
          to bottom,
          transparent 0px,
          black ${topFade}px,
          black ${bottomFadeStart}%,
          transparent 100%
        )`,
        maskImage: `linear-gradient(
          to bottom,
          transparent 0px,
          black ${topFade}px,
          black ${bottomFadeStart}%,
          transparent 100%
        )`,
      }}
    >

      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/55" />
      <div
        className="grid absolute inset-0"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, ${tile}px)`,
          gridTemplateRows: `repeat(${grid.rows}, ${tile}px)`,
        }}
      >
        {Array.from({ length: total }).map((_, idx) => {
          const r = Math.floor(idx / grid.cols);
          const c = idx % grid.cols;
          const isBlack = (r + c) % 2 === 1;

          const isFast = idx < fastTiles;
          const stagger = isFast ? idx * 0.0012 : idx * 0.0032;
          const duration = isFast ? 0.28 : 0.62;

          const local = clamp01((progress - stagger) / duration);
          const o = isFast ? easeOutExp(local) : easeOutCubic(local);

          return (
            <div
              key={idx}
              className={isBlack ? "bg-black" : "bg-white"}
              style={{
                width: tile,
                height: tile,
                opacity: o,
                transform: `translate3d(0, ${(1 - o) * (isFast ? 2 : 8)}px, 0)`,
                filter: `blur(${(1 - o) * (isFast ? 0.1 : 0.8)}px)`,
              }}
            />
          );
        })}
      </div>

      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: tile,
          background: "white",
          opacity: 1,
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />
    </div>
  );
}

type TrackVariant = "oval" | "chicane" | "figure8" | "hairpin";

function RaceTrackTile({
  label,
  title,
  body,
  variant,
}: {
  label: string;
  title: string;
  body: string;
  variant: TrackVariant;
}) {
  const d = TRACK_PATHS[variant];

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/90 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.35)] md:p-5 lg:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-24 -top-28 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -right-28 -bottom-28 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-[1fr_132px] items-center gap-4 md:hidden">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-white/55">
                {label}
              </div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                {title}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white/70">
                {body}
              </div>
            </div>

            <div className="relative h-[92px] w-[132px]">
              <TrackSvg d={d} size="sm" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-[220px_1fr] md:items-center md:gap-5 lg:grid-cols-[280px_1fr] lg:gap-6">
            <div className="relative w-full max-w-[220px] lg:max-w-[280px]">
              <div className="relative aspect-[1.25/1] w-full">
                <TrackSvg d={d} size="md" />
                <div className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/75 backdrop-blur">
                    {label}
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-[12px] font-semibold tracking-[0.22em] text-white/55">
                {label}
              </div>

              <div className="mt-2 text-xl font-semibold tracking-tight text-white lg:text-2xl">
                {title}
              </div>

              <div className="mt-2 text-[15px] leading-relaxed text-white/70 lg:text-sm">
                {body}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackSvg({ d, size }: { d: string; size: "sm" | "md" | "lg" }) {
  const presets =
    size === "sm"
      ? { curbGlow: 14, curb1: 10, curb2: 6, curb3: 4, asphalt: 8, dash: 1.6 }
      : size === "md"
      ? { curbGlow: 18, curb1: 14, curb2: 8.5, curb3: 5.2, asphalt: 10, dash: 2.0 }
      : { curbGlow: 22, curb1: 18, curb2: 10, curb3: 6, asphalt: 12, dash: 2.2 };

  const { curbGlow, curb1, curb2, curb3, asphalt, dash } = presets;

  return (
    <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke="rgba(239,68,68,0.16)"
        strokeWidth={curbGlow}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(239,68,68,0.95)"
        strokeWidth={curb1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={curb2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(220,38,38,0.95)"
        strokeWidth={curb3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={d}
        fill="none"
        stroke="rgba(18,18,18,0.96)"
        strokeWidth={asphalt}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth={dash}
        strokeDasharray="7 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}
function easeOutExp(t: number) {
  t = clamp01(t);
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
function easeOut(t: number, a: number, b: number) {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const x = (t - a) / (b - a);
  return 1 - Math.pow(1 - x, 3);
}

function WelcomeBanner({
  progress,
  onDone,
}: {
  progress: number;
  onDone?: () => void;
}) {
  const START_AT = 0.22;

  const welcomeT = easeOut(progress, START_AT, START_AT + 0.16); // fade 
  const codeT = easeOut(progress, START_AT + 0.10, START_AT + 0.30);

  const doneRef = useRef(false);
  useEffect(() => {
    if (doneRef.current) return;
    if (codeT < 0.98) return;
    doneRef.current = true;
    onDone?.();
  }, [codeT, onDone]);

  return (
    <div className="boxed mx-auto inline-block text-center">
      <div
        className="font-racing text-5xl text-white drop-shadow-md md:text-6xl"
        style={{
          opacity: welcomeT,
          transform: `translate3d(0, ${(1 - welcomeT) * 10}px, 0)`,
          transition: "opacity 120ms linear, transform 120ms linear",
        }}
      >
        Welcome to
      </div>

      <div
        className="font-racing text-5xl text-white drop-shadow-md md:text-6xl"
        style={{
          opacity: codeT,
          transform: `translate3d(${(1 - codeT) * 22}px, 0, 0)`,
          transition: "opacity 120ms linear, transform 120ms linear",
        }}
      >
        Code Quantum
      </div>
    </div>
  );
}

function RoadRevealBanner({
  progress,
  canRun,
}: {
  progress: number;
  canRun: boolean;
}) {
  const DURATION_MS = 2400;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const roadRef = useRef<HTMLDivElement | null>(null);
  const carRef = useRef<HTMLImageElement | null>(null);

  const ranRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [inView, setInView] = useState(false);
  const [carX, setCarX] = useState(-200);
  const [reveal, setReveal] = useState(0);

  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.15, 0.35, 0.6, 1] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // car goes when scrolled down once
  useEffect(() => {
    if (!inView) return;
    if (!canRun) return;
    if (ranRef.current) return;

    const road = roadRef.current;
    if (!road) return;

    ranRef.current = true;

    const carW = carRef.current?.getBoundingClientRect().width ?? 140;

    setCarX(-carW);
    setReveal(0);

    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);

      const roadW = road.clientWidth;
      const x = lerp(-carW, roadW + carW, easeOutCubic(t));
      const r = clamp01((x + carW * 0.7) / roadW);

      setCarX(x);
      setReveal(r);

      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = null;
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [inView, canRun]);

  const fade = easeOut(progress, 0.12, 0.45);

  return (
    <div
      ref={wrapRef}
      className="relative left-1/2 right-1/2 -mx-[50vw] mt-7 w-screen"
      style={{
        opacity: fade,
        transform: `translate3d(0, ${(1 - fade) * 10}px, 0)`,
      }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
        <div
          ref={roadRef}
          className="relative py-6 md:py-7"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,18,20,1) 0%, rgba(12,12,14,1) 55%, rgba(18,18,20,1) 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(1200px 220px at 50% 50%, rgba(255,255,255,0.06), transparent 60%)," +
                "radial-gradient(900px 220px at 20% 50%, rgba(255,255,255,0.05), transparent 60%)," +
                "radial-gradient(900px 220px at 80% 50%, rgba(255,255,255,0.05), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 7px)",
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[14px] md:h-4 opacity-90 blur-[0.2px]"
            style={curbStripeStyle}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[14px] md:h-4 opacity-90 blur-[0.2px]"
            style={curbStripeStyle}
          />

          <div className="relative mx-auto max-w-5xl px-6 md:px-10">
            <div
              style={{
                clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
                willChange: "clip-path",
              }}
            >
              <div className="mx-auto max-w-4xl text-center">

                <p className="mt-2 text-[15px] font-normal leading-relaxed text-white/90 md:text-[17px]">
                  <Balancer>
                  CodeQuantum is a 12-hour, beginner friendly hackathon for everyone to join and enjoy, designed to represent everyone’s diverse range of ideas in a welcoming environment. 
                  At the event, you’ll have the opportunity to create your own software and hardware products with up to 4 team members that wow yourself, mentors, and judges alike!
                  </Balancer>
                </p>
              </div>
            </div>
          </div>

          <img
            ref={carRef}
            src="/img/logo/topdown.png"
            alt="Car"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              width: 170,
              height: "auto",
              transform: `translate3d(${carX}px, -50%, 0)`,
              willChange: "transform",
              filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.55))",
            }}
          />
        </div>

        <div className="bg-zinc-950/70 px-6 py-6 md:px-10 md:py-7">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium tracking-[0.18em] text-white/60">
                QUICK ANSWERS
              </div>
              <div className="h-px flex-1 mx-4 bg-white/10" />
              <div className="text-xs text-white/45">tap to expand</div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <FaqItem
                id="bring"
                openId={openId}
                setOpenId={setOpenId}
                question="What should I bring?"
                answer="We will provide drinks and snacks, all you need is yourself, a laptop, and any peripherals you want to use (chargers, mice, etc.), and some comfortable clothes."
              />
              <FaqItem
                id="project"
                openId={openId}
                setOpenId={setOpenId}
                question="Can I work on my project before Code Quantum?"
                answer="Nope! The project needs to be started at the event."
              />
              <FaqItem
                id="nocode"
                openId={openId}
                setOpenId={setOpenId}
                question="What if I have never coded before?"
                answer="No worries :) we will provide guidance through mentors and beginner-friendly support."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  id,
  openId,
  setOpenId,
  question,
  answer,
}: {
  id: string;
  openId: string | null;
  setOpenId: (v: string | null) => void;
  question: string;
  answer: string;
}) {
  const isOpen = openId === id;

  return (
    <button
      type="button"
      onClick={() => setOpenId(isOpen ? null : id)}
      className={cn(
        "group text-left rounded-2xl border border-white/10 bg-white/[0.04] p-4",
        "shadow-[0_18px_40px_rgba(0,0,0,0.25)]",
        "transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-red-500/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[15px] font-semibold text-white/90 leading-snug">
          {question}
        </div>

        <div
          className={cn(
            "mt-0.5 h-8 w-8 rounded-full bg-black/35 grid place-items-center border border-white/10",
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <span className="text-white/70">⌄</span>
        </div>
      </div>

      {/* animated reveal */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden text-sm leading-relaxed text-white/70">
          {answer}
        </div>
      </div>

      <div
        className={cn(
          "mt-4 h-px w-full bg-gradient-to-r from-red-500/0 via-red-500/35 to-red-500/0",
          isOpen ? "opacity-100" : "opacity-40"
        )}
      />
    </button>
  );
}



const curbStripeStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg," +
    "rgba(217,59,57,0.8) 0px, rgba(217,59,57,0.8) 18px," +   // red
    "rgba(255,255,255,0.98) 18px, rgba(255,255,255,0.98) 36px," + // white
    "rgba(217,59,57,0.8) 36px, rgba(217,59,57,0.8) 54px" +  // red
    ")",
  boxShadow:
    "inset 0 -2px 0 rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.18)",
};

const curbRedWhiteRedStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to bottom," +
    "rgba(239,68,68,0.95) 0%," +
    "rgba(239,68,68,0.95) 33%," +
    "rgba(255,255,255,0.92) 33%," +
    "rgba(255,255,255,0.92) 66%," +
    "rgba(220,38,38,0.95) 66%," +
    "rgba(220,38,38,0.95) 100%)",
};


function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type StickerPos = "tl" | "tr" | "bl" | "br";

//can be changed not too sure about them rn
const TRACK_PATHS: Record<TrackVariant, string> = {
  oval: "M50,80 C50,45 75,25 100,25 C125,25 150,45 150,80 C150,115 125,135 100,135 C75,135 50,115 50,80 Z",

  chicane:
    "M55,40 C90,15 140,25 145,55 C150,85 105,80 95,95 C80,120 115,145 145,125 C175,105 165,60 125,65 C95,70 85,40 55,40 Z",

  figure8:
    "M100,30 C70,30 55,50 55,70 C55,90 70,110 100,110 C130,110 145,90 145,70 C145,50 130,30 100,30 Z M100,50 C120,50 130,60 130,70 C130,80 120,90 100,90 C80,90 70,80 70,70 C70,60 80,50 100,50 Z M100,130 C70,130 55,110 55,90 C55,70 70,50 100,50 C130,50 145,70 145,90 C145,110 130,130 100,130 Z",

  hairpin:
    "M55,55 C70,35 110,30 135,45 C160,60 160,100 135,115 C110,130 70,125 55,105 C40,85 60,75 80,80 C95,85 105,105 125,100 C140,95 140,65 125,60 C110,55 95,65 80,70 C60,78 40,75 55,55 Z",
};


const curbRedWhiteRed: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right," +
    "rgba(239,68,68,0.95) 0%," +
    "rgba(239,68,68,0.95) 33.33%," +
    "rgba(255,255,255,0.92) 33.33%," +
    "rgba(255,255,255,0.92) 66.66%," +
    "rgba(239,68,68,0.95) 66.66%," +
    "rgba(239,68,68,0.95) 100%)",
  backgroundSize: "54px 100%",
};
