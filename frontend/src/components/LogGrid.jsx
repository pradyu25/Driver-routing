
import React from 'react';

const STATUS_Y = {
    'OFF': 20,
    'SB': 50, // Sleeper Berth
    'DRIVING': 80,
    'ON': 110
};

const STATUS_LABELS = {
    'OFF': 'OFF DUTY',
    'SB': 'SLEEPER',
    'DRIVING': 'DRIVING',
    'ON': 'ON DUTY'
};

const LogGrid = ({ logs, date }) => {
    // logs: [{status, start, end}, ...]
    // Width 800px. Height 150px.
    // X scale = 800 / 24

    const width = 800;
    const height = 150;
    const hourWidth = width / 24;

    // Draw Grid Lines
    const gridLines = [];
    for (let i = 0; i <= 24; i++) {
        gridLines.push(
            <line key={`grid-${i}`} x1={i * hourWidth} y1={0} x2={i * hourWidth} y2={height} stroke="#e5e7eb" strokeWidth="1" />
        );
        // Hour Label
        if (i < 24) {
            gridLines.push(
                <text key={`label-${i}`} x={i * hourWidth + 2} y={height - 5} fontSize="10" fill="#9ca3af">{i}</text>
            );
        }
    }

    // Draw Status Lines
    const statusLines = Object.entries(STATUS_Y).map(([status, y]) => (
        <g key={status}>
            <line x1={0} y1={y} x2={width} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
            <text x={-60} y={y + 4} fontSize="10" fill="#6b7280" textAnchor="end">{STATUS_LABELS[status]}</text>
        </g>
    ));

    // Draw Log Path
    let pathCmd = "";

    // We need to map logs to a continuous line.
    // (startX, startY) -> (endX, endY)
    // If next status changes, vertical line to next Y.

    if (logs && logs.length > 0) {
        // Sort logs by start
        logs.sort((a, b) => a.start - b.start);

        const first = logs[0];
        let currentX = first.start * hourWidth;
        let currentY = STATUS_Y[first.status === 'SLEEPER' ? 'SB' : (first.status === 'ON' ? 'ON' : first.status)];
        // Normalize status names: 'SLEEPER' -> 'SB', 'ON-DUTY' -> 'ON'?
        // API returns: OFF, ON, DRIVING. Sleeper is usually separate but my ELD engine generates OFF/ON/DRIVING.
        // If my engine doesn't generate SB, just use OFF/ON/DRIVING.

        pathCmd += `M ${currentX} ${currentY}`;

        logs.forEach((log, index) => {
            const startX = log.start * hourWidth;
            const endX = log.end * hourWidth;
            const statusKey = log.status === 'SLEEPER' ? 'SB' : (log.status === 'ON' ? 'ON' : (log.status === 'DRIVING' ? 'DRIVING' : 'OFF'));
            const y = STATUS_Y[statusKey] || STATUS_Y['OFF'];

            // If startX != currentX (gap?), move? No, assume contiguous.
            // If new status (y != currentY), vertical line drawn implicitly by L command.

            // Horizontal line for duration
            pathCmd += ` L ${startX} ${y}`; // Vertical segment if Y changed
            pathCmd += ` L ${endX} ${y}`;   // Horizontal segment

            currentX = endX;
            currentY = y;
        });
    }

    return (
        <div className="overflow-x-auto p-4 bg-white rounded shadow mb-4">
            <h3 className="text-lg font-bold mb-2">Driver's Daily Log - {date}</h3>
            <svg width={width + 80} height={height + 20} viewBox={`-70 -10 ${width + 80} ${height + 20}`}>
                {gridLines}
                {statusLines}
                <path d={pathCmd} fill="none" stroke="#2563eb" strokeWidth="2" />
            </svg>
            <div className="mt-2 text-sm text-gray-500">
                <span className="mr-4">Cycle Used: Calculated...</span>
            </div>
        </div>
    );
};

export default LogGrid;
