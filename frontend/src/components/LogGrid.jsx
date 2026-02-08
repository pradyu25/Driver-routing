
import React from 'react';

const PaperLogGrid = ({ logs }) => {
    // FMCSA Style Log Grid
    // 24 Hour horizontal timeline
    // Rows: OFF DUTY, SLEEPER BERTH, DRIVING, ON DUTY

    const width = 800;
    const height = 160;
    const rowHeight = 40;
    const hourWidth = width / 24;
    const margin = { top: 20, right: 30, bottom: 20, left: 100 };

    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const STATUS_ROWS = [
        { id: 'OFF', label: '1. OFF DUTY', y: 0 },
        { id: 'SB', label: '2. SLEEPER BERTH', y: rowHeight },
        { id: 'DRIVING', label: '3. DRIVING', y: rowHeight * 2 },
        { id: 'ON', label: '4. ON DUTY (Not Driving)', y: rowHeight * 3 },
    ];

    // Helper to get Y for a status
    const getY = (status) => {
        const row = STATUS_ROWS.find(r => r.id === status) || STATUS_ROWS[0];
        return row.y + (rowHeight / 2);
    };

    // Normalize incoming status names
    const normalizeStatus = (status) => {
        if (status === 'SLEEPER' || status === 'SB') return 'SB';
        if (status === 'ON-DUTY' || status === 'ON') return 'ON';
        if (status === 'DRIVING') return 'DRIVING';
        return 'OFF';
    };

    // Generate Path
    let pathCmd = "";
    if (logs && logs.length > 0) {
        const sortedLogs = [...logs].sort((a, b) => a.start - b.start);

        sortedLogs.forEach((log, i) => {
            const status = normalizeStatus(log.status);
            const startX = log.start * hourWidth;
            const endX = log.end * hourWidth;
            const y = getY(status);

            if (i === 0) {
                pathCmd += `M ${startX} ${y}`;
            } else {
                // Vertical line from previous Y to current Y
                pathCmd += ` L ${startX} ${y}`;
            }
            // Horizontal line across duration
            pathCmd += ` L ${endX} ${y}`;
        });
    }

    // Grid Helpers
    const hours = Array.from({ length: 25 }, (_, i) => i);
    const fifteenMinTicks = Array.from({ length: 24 * 4 }, (_, i) => i);

    return (
        <div className="bg-white border-x-2 border-slate-900 group">
            <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Background */}
                <rect x={margin.left} y={margin.top} width={width} height={height} fill="white" />

                {/* Grid Lines */}
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Horizontal Borders */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <line
                            key={`h-${i}`}
                            x1={0} y1={i * rowHeight}
                            x2={width} y2={i * rowHeight}
                            stroke="black" strokeWidth={i === 0 || i === 4 ? 2 : 1}
                        />
                    ))}

                    {/* Vertical Lines & Ticks */}
                    {fifteenMinTicks.map(t => {
                        const x = t * (hourWidth / 4);
                        const isHour = t % 4 === 0;
                        const isHalf = t % 4 === 2;
                        return (
                            <line
                                key={`tick-${t}`}
                                x1={x} y1={0} x2={x} y2={height}
                                stroke="black"
                                strokeWidth={isHour ? 1 : 0.5}
                                opacity={isHour ? 0.3 : 0.1}
                            />
                        );
                    })}

                    {/* Labels & Major Hour Lines */}
                    {hours.map(h => {
                        const x = h * hourWidth;
                        return (
                            <g key={`hour-${h}`}>
                                <line
                                    x1={x} y1={-5} x2={x} y2={height + 5}
                                    stroke="black" strokeWidth={h % 12 === 0 ? 2 : 1}
                                />
                                {h < 24 && (
                                    <text
                                        x={x + 2} y={-8}
                                        fontSize="10" fontWeight="bold"
                                        fontFamily="monospace"
                                    >
                                        {h === 0 ? 'MDT' : h === 12 ? 'NOON' : h}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Status Labels (Left Column) */}
                    {STATUS_ROWS.map(row => (
                        <text
                            key={row.id}
                            x={-5} y={row.y + (rowHeight / 2) + 4}
                            textAnchor="end"
                            fontSize="10"
                            fontWeight="bold"
                            className="fill-slate-900"
                        >
                            {row.label}
                        </text>
                    ))}

                    {/* The Path */}
                    <path
                        d={pathCmd}
                        fill="none"
                        stroke="#000" // Traditional black ink style
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="square"
                    />
                </g>
            </svg>
        </div>
    );
};

export default PaperLogGrid;
