import { useEffect, useRef } from 'react';

export default function LiveLog({ logs }) {
    const logEndRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="card p-4 flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-carbon-text mb-3">
                Activity Log
            </h3>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 min-h-0">
                {logs.length === 0 ? (
                    <div className="text-center py-8 text-carbon-text-secondary text-sm">
                        No activity yet
                    </div>
                ) : (
                    <>
                        {logs.map((log, index) => (
                            <div key={index} className="log-entry">
                                <span className="timestamp">[{log.timestamp}]</span>
                                {' '}
                                <span className={
                                    log.type === 'error' ? 'text-carbon-danger' :
                                        log.type === 'success' ? 'text-carbon-accent' :
                                            'text-carbon-text-secondary'
                                }>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}
