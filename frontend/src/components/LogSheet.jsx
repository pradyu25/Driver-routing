
import React from 'react';
import PaperLogGrid from './LogGrid';

const Field = ({ label, value, className = "" }) => (
    <div className={`border border-black p-1 flex flex-col ${className}`}>
        <span className="text-[9px] font-bold uppercase text-slate-500 leading-none mb-1">{label}</span>
        <span className="text-xs font-mono font-medium truncate">{value || 'N/A'}</span>
    </div>
);

const PaperLogSheet = ({ dayData, trip }) => {
    // dayData: { day, date, logs }

    // Calculate totals for summary
    const totals = dayData.logs.reduce((acc, log) => {
        const duration = log.end - log.start;
        acc[log.status] = (acc[log.status] || 0) + duration;
        return acc;
    }, {});

    const totalDriving = (totals['DRIVING'] || 0).toFixed(2);
    const totalOnDuty = ((totals['DRIVING'] || 0) + (totals['ON'] || 0)).toFixed(2);

    // Extract remarks (stops for this day?)
    // This requires backend to provide stops per day or calculating it.
    // For now, we'll use a placeholder or generic remarks.

    return (
        <div className="bg-white p-8 mb-12 shadow-paper max-w-[900px] mx-auto border border-slate-200 print:shadow-none print:m-0 print:border-none font-sans text-slate-900">
            {/* Header Section */}
            <div className="border-2 border-slate-900 mb-4 p-4">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2 mb-2">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Driver's Daily Log</h1>
                        <p className="text-[10px] font-bold uppercase mt-1">(Property-Carrying Vehicle)</p>
                    </div>
                    <div className="flex gap-4">
                        <Field label="Day" value={dayData.day} className="w-12 text-center" />
                        <Field label="Date" value={dayData.date} className="w-32" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                    <Field label="Carrier" value="Autonomous Logistics Corp" />
                    <Field label="Main Office Address" value="123 Hauler Way, Transport City, TX 75001" />
                    <Field label="Home Terminal" value={trip?.start_location} />
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <Field label="Truck / Tractor No." value="Unit 402-A" />
                    <Field label="Trailer No(s)." value="T-88229, T-1102" />
                    <Field label="License Plate" value="TX-DR1V3R" />
                    <Field label="Shipping Doc No." value="BOL# 99827361" />
                </div>
            </div>

            {/* The SVG Grid */}
            <PaperLogGrid logs={dayData.logs} />

            {/* Remarks & Footer Section */}
            <div className="mt-4 grid grid-cols-3 gap-4 border-2 border-slate-900 p-4">
                {/* Remarks */}
                <div className="col-span-2 border-r border-slate-900 pr-4">
                    <span className="text-[9px] font-bold uppercase text-slate-500 block mb-2">Remarks</span>
                    <div className="min-h-[100px] border border-black/10 relative overflow-hidden bg-[linear-gradient(transparent_1.4rem,#e2e8f0_1.5rem)] bg-[length:100%_1.5rem]">
                        <div className="p-2 text-xs font-mono space-y-1">
                            {/* Mock remarks based on status changes */}
                            {trip?.markers?.map((m, i) => (
                                <div key={i} className="flex justify-between">
                                    <span>{m.type}: {m.label || m.metadata?.distance_miles + ' mi'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="col-span-1 space-y-2">
                    <span className="text-[9px] font-bold uppercase text-slate-500 block mb-2">Daily Summary</span>
                    <div className="space-y-1">
                        <div className="flex justify-between border-b border-black">
                            <span className="text-[10px] font-bold">Total Driving Hours:</span>
                            <span className="text-xs font-mono font-bold">{totalDriving}</span>
                        </div>
                        <div className="flex justify-between border-b border-black">
                            <span className="text-[10px] font-bold">Total On-Duty:</span>
                            <span className="text-xs font-mono font-bold">{totalOnDuty}</span>
                        </div>
                    </div>

                    <div className="mt-4 p-2 bg-slate-50 border border-slate-200 rounded">
                        <span className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Cycle Recap (8 Days / 70 Hrs)</span>
                        <div className="flex justify-between items-end">
                            <span className="text-lg font-black text-slate-900">{70 - (trip?.current_cycle_used || 0)}</span>
                            <span className="text-[8px] uppercase font-bold text-slate-500 mb-1">Hours Remaining</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-8 border-t border-black text-center">
                        <span className="text-[8px] font-bold border-t border-black px-4 pt-1">Driver's Signature</span>
                    </div>
                </div>
            </div>

            <div className="mt-2 text-[8px] text-center text-slate-400 uppercase tracking-widest font-bold">
                I certify these entries are true and correct | FMCSA CFR 395.8 Compliant Output
            </div>
        </div>
    );
};

export default PaperLogSheet;
