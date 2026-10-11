import React, { useEffect, useState } from 'react';
import {
  Apple,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  Bot,
  Heart,
  CheckCircle2,
  ArrowDownToLine,
} from 'lucide-react';

const APP_STORE_URL = 'https://apps.apple.com/sg/app/tokitail/id6787365554';

type Platform = 'ios' | 'android' | 'desktop';

const detectPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
};

const GooglePlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.6 1.9a1.5 1.5 0 0 0-.6 1.2v17.8c0 .5.2.9.6 1.2L13.4 12 3.6 1.9zm11.2 11.3L5.3 22.6a1.6 1.6 0 0 0 1.5-.2l11.4-6.5-3.4-2.7zm6.2-3.5-2.4-1.4-3.6 3.7 3.6 3.6 2.4-1.4a1.6 1.6 0 0 0 0-2.8l-.0-.0zM6.8 1.6a1.6 1.6 0 0 0-1.5-.2l9.5 9.5 3.4-2.7L6.8 1.6z" />
  </svg>
);

const Download: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPlatform(detectPlatform());
  }, []);

  const isMobile = platform === 'ios' || platform === 'android';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_STORE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 overflow-hidden">
      {/* ======================= HERO ======================= */}
      <section className="relative pb-16 lg:pb-24">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* -------- Left: Text + CTAs + QR -------- */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-pawly-orange px-4 py-1.5 rounded-full font-bold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Available on iPhone & iPad
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6 text-gray-900">
              Take Toki Tail<br />
              <span className="text-pawly-orange">anywhere you go.</span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Your AI pet-care companion, right in your pocket. Triage symptoms, log health, and get vet-informed guidance — 24/7.
            </p>

            {/* Download card */}
            <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl shadow-orange-100/40 p-6 sm:p-8 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* QR Code - highlighted on desktop, visible as secondary on mobile */}
                <div className={`relative shrink-0 ${isMobile ? 'order-2' : 'order-1'}`}>
                  <div className="relative bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                    <img
                      src="/app-qr.jpg"
                      alt="Scan QR code to download Toki Tail"
                      className="w-36 h-36 sm:w-40 sm:h-40 block"
                    />
                    {/* Logo in center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-pawly-orange">
                        <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
                      </div>
                    </div>
                  </div>
                  {!isMobile && (
                    <div className="absolute -top-3 -right-3 bg-pawly-orange text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                      <ScanLine className="w-3 h-3" />
                      SCAN ME
                    </div>
                  )}
                </div>

                {/* CTA column */}
                <div className={`flex-1 w-full ${isMobile ? 'order-1' : 'order-2'}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 text-center md:text-left">
                    {isMobile ? 'Tap to install' : 'Scan with your phone camera'}
                  </p>

                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-pawly-dark text-white px-5 py-3.5 rounded-2xl font-bold flex items-center justify-between gap-4 shadow-xl hover:bg-gray-800 transition transform hover:-translate-y-0.5 active:translate-y-0 duration-200 w-full mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <Apple className="w-7 h-7" />
                      <div className="text-left leading-tight">
                        <div className="text-[10px] font-medium opacity-70">Download on the</div>
                        <div className="text-lg font-bold -mt-0.5">App Store</div>
                      </div>
                    </div>
                    <ArrowDownToLine className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-y-0.5 transition" />
                  </a>

                  {/* Android "coming soon" */}
                  <button
                    disabled
                    className="bg-gray-100 text-gray-400 px-5 py-3.5 rounded-2xl font-bold flex items-center justify-between gap-4 w-full cursor-not-allowed border border-dashed border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <GooglePlayIcon className="w-6 h-6" />
                      <div className="text-left leading-tight">
                        <div className="text-[10px] font-medium">Get it on</div>
                        <div className="text-lg font-bold -mt-0.5">Google Play</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  </button>
                </div>
              </div>

              {/* Copy link row */}
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
                <code className="flex-1 text-xs text-gray-500 font-mono truncate bg-gray-50 px-3 py-2 rounded-lg">
                  {APP_STORE_URL}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="text-xs font-bold text-pawly-orange hover:text-orange-600 transition px-3 py-2 rounded-lg hover:bg-orange-50"
                >
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            </div>

            {/* Micro-trust */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-pawly-green" />
                Privacy first
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-500" />
                iOS 16+
              </span>
            </div>
          </div>

          {/* -------- Right: Phone Mockup -------- */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative badges */}
              <div className="hidden lg:flex absolute -top-4 -left-10 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-pawly-green" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">New today</p>
                  <p className="font-bold text-sm text-gray-800">Vaccine reminder</p>
                </div>
              </div>

              <div className="hidden lg:flex absolute -bottom-4 -right-6 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Mood check</p>
                  <p className="font-bold text-sm text-gray-800">Luna is happy 💛</p>
                </div>
              </div>

              {/* Phone frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-3 w-[280px] sm:w-[320px] shadow-2xl ring-4 ring-gray-200/50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20" />

                <div className="bg-gradient-to-b from-orange-50 via-white to-amber-50 rounded-[2.3rem] h-[600px] flex flex-col overflow-hidden relative">
                  {/* Status bar space */}
                  <div className="h-10" />

                  {/* App header */}
                  <div className="px-5 pt-2 pb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Good morning</p>
                      <p className="font-heading font-bold text-xl text-gray-900">Hi, Luna 🐾</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-pawly-orange flex items-center justify-center text-white shadow-md">
                      <Bot className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Pet card */}
                  <div className="mx-5 bg-white rounded-2xl p-4 shadow-md border border-gray-50">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-xl object-cover"
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&h=200&q=80"
                        alt=""
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">Luna</p>
                        <p className="text-xs text-gray-500">Golden Retriever · 3 yr</p>
                      </div>
                      <div className="bg-green-100 text-pawly-green rounded-full px-2.5 py-1 text-[10px] font-bold">
                        Healthy
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-orange-50 rounded-xl py-2">
                        <p className="text-[10px] text-gray-500 font-semibold">Weight</p>
                        <p className="text-sm font-bold text-gray-900">24kg</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl py-2">
                        <p className="text-[10px] text-gray-500 font-semibold">Walks</p>
                        <p className="text-sm font-bold text-gray-900">2/2</p>
                      </div>
                      <div className="bg-pink-50 rounded-xl py-2">
                        <p className="text-[10px] text-gray-500 font-semibold">Mood</p>
                        <p className="text-sm font-bold text-gray-900">😊</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat preview */}
                  <div className="flex-1 px-5 pt-5 space-y-3 overflow-hidden">
                    <div className="bg-pawly-orange text-white rounded-2xl rounded-br-sm max-w-[80%] ml-auto px-4 py-2.5 text-sm shadow-sm">
                      Luna skipped breakfast today 🥺
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm max-w-[85%] mr-auto px-4 py-2.5 text-sm text-gray-700 shadow-sm">
                      I hear you. A missed meal can be normal — let's monitor. Any other changes you noticed?
                    </div>
                    <div className="flex items-center gap-1 mr-auto">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-typing" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div className="mx-5 mb-4 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-around py-3">
                    <div className="w-6 h-6 bg-pawly-orange/15 rounded-md" />
                    <div className="w-6 h-6 bg-gray-100 rounded-md" />
                    <div className="w-6 h-6 bg-gray-100 rounded-md" />
                    <div className="w-6 h-6 bg-gray-100 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= WHY DOWNLOAD ======================= */}
      <section className="py-16 lg:py-24 bg-pawly-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Why pet parents keep it open.
            </h2>
            <p className="text-gray-600 text-lg">
              Three things the app does on day one.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Instant triage',
                body: 'Describe a symptom — get a clear Green / Yellow / Red answer, with next steps.',
                tint: 'bg-amber-100 text-amber-600',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'A health diary that remembers',
                body: 'Weight, meals, walks, moods — logged in seconds, trended over time.',
                tint: 'bg-pink-100 text-pink-600',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: 'Vet-informed, privacy first',
                body: 'Grounded in evidence-based guidance. Your pet’s data stays yours.',
                tint: 'bg-green-100 text-pawly-green',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-3xl p-7 shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-white"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${f.tint}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= HOW TO INSTALL ======================= */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Install in three steps.
            </h2>
            <p className="text-gray-600 text-lg">Under 30 seconds, we promise.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-pawly-orange/20 via-pawly-orange/60 to-pawly-orange/20" />

            {[
              { n: '01', title: 'Open your camera', body: 'Point it at the QR code above — no app needed.' },
              { n: '02', title: 'Tap the App Store link', body: 'iOS recognises it and opens Toki Tail’s page.' },
              { n: '03', title: 'Meet your companion', body: 'Set up your pet’s profile and start a chat.' },
            ].map((s) => (
              <div key={s.n} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-full border-4 border-pawly-orange text-pawly-orange font-heading font-extrabold text-xl shadow-lg mb-5">
                  {s.n}
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px] max-w-xs mx-auto">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FINAL CTA ======================= */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-pawly-orange via-orange-400 to-amber-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 70%, white 2px, transparent 2px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-heading font-extrabold mb-5 leading-tight">
            Ready when they need you.
          </h2>
          <p className="text-lg lg:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Download Toki Tail now — your pocket pet-care expert is one tap away.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white text-pawly-dark px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-black/20 transition transform hover:scale-105 active:scale-95 duration-200 flex items-center gap-3"
            >
              <Apple className="w-6 h-6" />
              Download on the App Store
            </a>
            <span className="text-white/80 text-sm font-semibold">or scan the QR code above</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Download;
