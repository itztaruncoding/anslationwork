import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./Home.css";

function Home() {
    const [html, setHtml] = useState("<h1>Welcome</h1>");
    const [css, setCss] = useState("h1 { color: red; }");

    const downloadCode = () => {
        const file = new Blob(
            [`<style>${css}</style>${html}`],
            { type: "text/html" }
        );

        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = "index.html";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="container">
            <h1 className="title">HTML/CSS Editor</h1>

            <div className="editor-section">
                <div className="htmleditor-box">
                    <h2>HTML Editor</h2>
                    <Editor
                        height="300px"
                        language="html"
                        theme="vs-dark"
                        value={html}
                        onChange={(value) => setHtml(value)}
                    />
                </div>

                <div className="csseditor-box">
                    <h2>CSS Editor</h2>
                    <Editor
                        height="300px"
                        language="css"
                        theme="vs-white"
                        value={css}
                        onChange={(value) => setCss(value)}
                    />
                </div>
            </div>

            <button onClick={downloadCode} className="download-btn">
                Save Code
            </button>

            <div className="preview-section"><h2>Live Preview</h2>

                <iframe
                    title="preview"
                    srcDoc={`<style>${css}</style>${html}`}
                />
            </div>
        </div>
    );
}

export default Home;