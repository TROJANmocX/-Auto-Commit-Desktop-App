import { useState } from 'react';

export default function CommitSection({
    commitMessage,
    useRandomMessages,
    customMessages,
    onCommitMessageChange,
    onUseRandomMessagesChange,
    onCustomMessagesChange,
    disabled
}) {
    const [messagePoolText, setMessagePoolText] = useState(
        customMessages.join('\n')
    );

    const handleMessagePoolChange = (text) => {
        setMessagePoolText(text);
        const messages = text.split('\n').filter(m => m.trim() !== '');
        onCustomMessagesChange(messages);
    };

    return (
        <div className="section">
            <h3 className="section-title">Commit Settings</h3>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-carbon-text-secondary mb-1">
                        Commit Message
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="minor update logic"
                        value={commitMessage}
                        onChange={(e) => onCommitMessageChange(e.target.value)}
                        disabled={disabled || useRandomMessages}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="useRandomMessages"
                        className="checkbox"
                        checked={useRandomMessages}
                        onChange={(e) => onUseRandomMessagesChange(e.target.checked)}
                        disabled={disabled}
                    />
                    <label
                        htmlFor="useRandomMessages"
                        className="text-sm text-carbon-text cursor-pointer"
                    >
                        Use random messages
                    </label>
                </div>

                {useRandomMessages && (
                    <div className="animate-fade-in">
                        <label className="block text-sm text-carbon-text-secondary mb-1">
                            Message Pool (one per line)
                        </label>
                        <textarea
                            className="input-field font-mono text-xs resize-none"
                            rows={6}
                            placeholder="minor update&#10;fix typo&#10;update documentation&#10;refactor code&#10;improve performance"
                            value={messagePoolText}
                            onChange={(e) => handleMessagePoolChange(e.target.value)}
                            disabled={disabled}
                        />
                        <div className="text-xs text-carbon-text-secondary mt-1">
                            {customMessages.length > 0
                                ? `${customMessages.length} messages in pool`
                                : 'Using default messages'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
