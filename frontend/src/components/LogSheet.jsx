
import React from 'react';
import LogGrid from './LogGrid';

const LogSheet = ({ eldLogs }) => {
    // eldLogs is dict: { "days": [ {day:1, logs:[]}, ... ], "stops": ... (but we use 'eld_logs' field from API which is list of days directly from engine if updated, wait) }

    // Check API response structure from tests/views:
    // View: `eld_logs = logs` (list of day objects).
    // So `eldLogs` prop is Array.

    if (!eldLogs || eldLogs.length === 0) return <div className="text-gray-500">No logs generated.</div>;

    return (
        <div className="space-y-8">
            {eldLogs.map((dayLog) => (
                <div key={dayLog.day}>
                    <LogGrid logs={dayLog.logs} date={`Day ${dayLog.day}`} />
                </div>
            ))}
        </div>
    );
};

export default LogSheet;
