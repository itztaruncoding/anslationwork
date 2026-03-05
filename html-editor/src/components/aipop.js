import React from "react";

function AIPopup({ close }) {
    return (
        <div className="ai-overlay">
            <div className="ai-modal">
                <button className="close-btn" onClick={close}>✖</button>

                <h2>Ask AI</h2>

                <input type="text" placeholder="Ask anything..." />
                <button>Search</button>
            </div>
        </div>
    );
}

export default AIPopup;