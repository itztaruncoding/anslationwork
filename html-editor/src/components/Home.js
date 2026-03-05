import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./Home.css";
import { Box, Typography, Paper, Grid, Card, CardContent, Divider } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

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
        document.body.removeChild(element);
    };

    return (
        <Box id="home">
            <Typography variant="h3" className="home-title">
                Write Code
            </Typography>

            <Grid className="editor-grid">
                <Grid className="editor-grid-item">
                    <Card className="editor-card">
                        <CardContent className="editor-card-content">
                            <Typography variant="h5" className="editor-label">
                                HTML Editor
                            </Typography>
                        </CardContent>
                        <Box className="editor-box">
                            <Editor
                                height="450px"

                                language="html"
                                theme="vs-dark"
                                value={html}
                                onChange={(value) => setHtml(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 22,
                                    fontFamily: 'Fira Code, monospace'
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid className="editor-grid-item">
                    <Card className="editor-card">
                        <CardContent className="editor-card-content">
                            <Typography variant="h5" className="editor-label">
                                CSS Editor
                            </Typography>
                        </CardContent>
                        <Box className="editor-box">
                            <Editor
                                height="450px"

                                language="css"
                                theme="vs-dark"
                                value={css}
                                onChange={(value) => setCss(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 22,
                                    fontFamily: 'Fira Code, monospace'
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Box className="save-button-container">
                <button
                    className="save-button"
                    onClick={downloadCode}
                >
                    <DownloadIcon style={{ marginRight: '8px' }} />
                    Save Code
                </button>
            </Box>

            <div className="preview-section">
                <h2 className="preview-title">
                    Live Preview
                </h2>


                <div className="preview-box">
                    <iframe
                        title="preview"
                        className="preview-iframe"

                        srcDoc={`<style>${css}</style>${html}`}
                    />
                </div>
            </div>
        </Box>
    );
}

export default Home;
