export default function DirtyRepoModal({ uncommittedCount, onCancel, onContinue }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-carbon-text mb-3">
                        Uncommitted Changes Detected
                    </h2>

                    <p className="text-sm text-carbon-text-secondary mb-4">
                        This repository has <span className="text-carbon-accent font-semibold">{uncommittedCount}</span> uncommitted {uncommittedCount === 1 ? 'change' : 'changes'}.
                    </p>

                    <p className="text-sm text-carbon-text-secondary mb-6">
                        Running this tool may complicate your Git history. Consider committing or stashing your changes first.
                    </p>

                    <div className="flex justify-end space-x-3">
                        <button
                            className="btn-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-danger"
                            onClick={onContinue}
                        >
                            Continue Anyway
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
