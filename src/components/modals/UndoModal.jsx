export default function UndoModal({ onCancel, onConfirm }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-carbon-text mb-3">
                        Undo Last Run
                    </h2>

                    <p className="text-sm text-carbon-text-secondary mb-6">
                        This will reset your repository to the state before the last run. All commits created in the last run will be removed.
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
                            onClick={onConfirm}
                        >
                            Undo Last Run
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
