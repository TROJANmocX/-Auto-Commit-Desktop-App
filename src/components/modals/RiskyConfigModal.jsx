export default function RiskyConfigModal({ onCancel, onContinue }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-carbon-text mb-3">
                        Risky Configuration
                    </h2>

                    <p className="text-sm text-carbon-text-secondary mb-6">
                        This pattern looks automated. More than 5 commits per day may appear suspicious on your GitHub profile.
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
                            I Know What I'm Doing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
