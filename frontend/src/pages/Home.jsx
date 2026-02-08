
import React from 'react';
import TripForm from '../components/TripForm';
import { Truck, ShieldCheck, Map, Globe, FileCheck, ArrowRight, Activity, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-50/50 via-white to-slate-100/50">
            {/* Ambient Background Graphics */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[5%] w-[40rem] h-[40rem] bg-brand-200/20 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] bg-indigo-200/20 blur-[100px] rounded-full"></div>
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center">
                {/* Hero Header */}
                <div className="text-center max-w-5xl mb-24 relative">
                    <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-slate-200 shadow-sm mb-10 group cursor-default">
                        <div className="p-1 px-3 bg-brand-600 rounded-full text-[10px] font-black text-white uppercase tracking-tighter mr-3">v2.1 Elite</div>
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center">
                            Network Status: <span className="text-green-500 ml-2 animate-pulse">Online</span>
                            <Zap className="w-3 h-3 ml-2 text-brand-500" />
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-950 tracking-[calc(-0.04em)] mb-10 leading-[0.85] filter drop-shadow-sm">
                        High Fidelity <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900">Logistic OS.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 font-bold max-w-3xl mx-auto leading-relaxed opacity-90">
                        The definitive computational framework for professional haulinig.
                        Precision routing meets audit-perfect log synthesis.
                    </p>
                </div>

                {/* Form Wrapper */}
                <div className="w-full mb-32">
                    <TripForm />
                </div>

                {/* Value Props Grid */}
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
                    {[
                        { icon: Map, color: 'text-brand-600', bg: 'bg-brand-50', title: 'Smart Pathing', desc: 'Enterprise-grade truck routing with weight & clearance analysis.' },
                        { icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Compliance+', desc: 'Strict adherence to FMCSA 395.8 rules with paper-accurate logs.' },
                        { icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50', title: 'Real-time GFX', desc: 'Dynamic SVG rendering for ultra-sharp log visualization.' },
                        { icon: Globe, color: 'text-slate-900', bg: 'bg-slate-100', title: 'Omni-Search', desc: 'Global address geocoding with intelligent autocomplete.' },
                    ].map((f, i) => (
                        <div key={i} className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-slate-200/50 rounded-[2.5rem] blur-sm -z-10 group-hover:opacity-100 transition-opacity"></div>
                            <div className="h-full p-10 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white hover:border-brand-200 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                                <div className={`p-5 rounded-2xl ${f.bg} inline-block mb-8 transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-2`}>
                                    <f.icon className={`w-8 h-8 ${f.color}`} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{f.title}</h3>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA / Branding */}
                <div className="mt-32 w-full pt-16 border-t border-slate-200/60 flex flex-col items-center">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
                        <ShieldCheck className="w-4 h-4 text-brand-500" />
                        <span>Trusted by Elite Owner-Operators Globally</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale filter invert transition-all hover:grayscale-0 hover:opacity-60 duration-700">
                        <span className="text-2xl font-black italic tracking-tighter">NAVISTAR</span>
                        <span className="text-2xl font-black italic tracking-tighter">SCANIA</span>
                        <span className="text-2xl font-black italic tracking-tighter">KENWORTH</span>
                        <span className="text-2xl font-black italic tracking-tighter">MACK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
