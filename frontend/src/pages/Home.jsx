
import React from 'react';
import TripForm from '../components/TripForm';
import { Truck, ShieldCheck, Map, Globe, FileCheck } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-full flex flex-col items-center justify-center space-y-16 animate-in fade-in duration-700 py-12 px-6">
            {/* Hero Section */}
            <div className="text-center max-w-3xl">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-xs font-black tracking-widest uppercase mb-8 border border-brand-100 shadow-sm">
                    <ShieldCheck className="w-3 h-3 mr-2" /> FMCSA CFR 395.8 COMPLIANT LOGS
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
                    Professional Grade <br />
                    <span className="text-brand-600">Trucking Logs</span> & Routing.
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                    The elite tool for commercial owner-operators. Generate audit-ready paper logs,
                    optimized HGV routes, and mandatory rest schedules in seconds.
                </p>
            </div>

            {/* Main Action Section */}
            <div className="w-full relative">
                <div className="absolute inset-0 bg-brand-600/5 blur-3xl rounded-full -z-10 transform scale-75" />
                <TripForm />
            </div>

            {/* Features Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { icon: Map, color: 'text-blue-600', bg: 'bg-blue-50', title: 'HGV Routing', desc: 'Bridge height & weight aware navigation.' },
                    { icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50', title: 'Paper Accuracy', desc: 'Logs indistinguishable from official forms.' },
                    { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Global Cities', desc: 'Address geocoding for any North American point.' },
                    { icon: ShieldCheck, color: 'text-slate-900', bg: 'bg-slate-100', title: 'Audit Ready', desc: 'Compliant with current hours-of-service rules.' },
                ].map((f, i) => (
                    <div key={i} className="group p-8 bg-white/50 backdrop-blur rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300">
                        <div className={`p-4 rounded-2xl ${f.bg} inline-block mb-6 transition-transform group-hover:scale-110`}>
                            <f.icon className={`w-6 h-6 ${f.color}`} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{f.title}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-normal">{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* Trust Banner */}
            <div className="pt-12 border-t border-slate-200 w-full flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Trusted Architecture Built for Precision</p>
                <div className="flex gap-12 opacity-40 grayscale filter h-8">
                    {/* Mock logos or text placeholders */}
                    <span className="text-xl font-black italic tracking-tighter">FEDERAL EXPRESS</span>
                    <span className="text-xl font-black italic tracking-tighter uppercase">FreightLine</span>
                    <span className="text-xl font-black italic tracking-tighter uppercase">Transitify</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
