import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./Home.css";
import { Box, Typography, Button, Paper, Grid, Card, CardContent, Divider } from "@mui/material";
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
        <Box
            id="home"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                py: { xs: 6, md: 8 },
                px: { xs: 2, md: 4 },
                background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Typography
                variant="h3"
                align="center"
                fontWeight={800}
                sx={{
                    mb: 4,
                    background: 'linear-gradient(135deg, #ff416c 0%, #4facfe 50%, #00f2fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: { xs: '28px', md: '48px' },
                    letterSpacing: '2px',
                    textTransform: 'capitalize',
                    flex: '0 0 auto',
                    display: 'block',
                    width: '100%',
                    lineHeight: 1.2
                }}
            >
                Write Code
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3, flex: '1 1 auto', display: 'flex', height: '100%', width: '100%' }}>
                <Grid item xs={12} sm={12} md={12} lg={6} sx={{ display: 'flex', height: '100%', width: '100%' }}>
                    <Card
                        elevation={0}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            background: 'rgba(0, 242, 254, 0.08)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(0, 242, 254, 0.2)',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 8px 30px rgba(0, 242, 254, 0.3)',
                                borderColor: 'rgba(0, 242, 254, 0.5)'
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, flex: '0 0 auto' }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #ff416c 0%, #4facfe 50%, #00f2fe 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: 700,
                                    letterSpacing: '1px'
                                }}
                            >
                                HTML Editor
                            </Typography>
                        </CardContent>
                        <Box sx={{ flex: '1 1 auto', overflow: 'hidden', px: 3, pb: 3, width: '100%' }}>
                            <Editor
                                height="100%"
                                width="100%"
                                language="html"
                                theme="vs-dark"
                                value={html}
                                onChange={(value) => setHtml(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    fontFamily: 'Fira Code, monospace'
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={6} sx={{ display: 'flex', height: '100%', width: '100%' }}>
                    <Card
                        elevation={0}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            background: 'rgba(0, 242, 254, 0.08)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(0, 242, 254, 0.2)',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 8px 30px rgba(0, 242, 254, 0.3)',
                                borderColor: 'rgba(0, 242, 254, 0.5)'
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, flex: '0 0 auto' }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #ff416c 0%, #4facfe 50%, #00f2fe 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: 700,
                                    letterSpacing: '1px'
                                }}
                            >
                                CSS Editor
                            </Typography>
                        </CardContent>
                        <Box sx={{ flex: '1 1 auto', overflow: 'hidden', px: 3, pb: 3, width: '100%' }}>
                            <Editor
                                height="100%"
                                width="100%"
                                language="css"
                                theme="vs-dark"
                                value={css}
                                onChange={(value) => setCss(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    fontFamily: 'Fira Code, monospace'
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mb: 3, flex: '0 0 auto' }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<DownloadIcon />}
                    onClick={downloadCode}
                    sx={{
                        borderRadius: '50px',
                        px: 6,
                        py: 2,
                        fontWeight: 700,
                        fontSize: 16,
                        background: 'linear-gradient(135deg, #ff416c 0%, #ff8c42 100%)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 15px rgba(255, 65, 108, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 10px 30px rgba(255, 65, 108, 0.6)'
                        }
                    }}
                >
                    Save Code
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: '12px',
                    background: 'rgba(0, 242, 254, 0.08)',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                    flex: '0 0 auto',
                    overflow: 'auto'
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        mb: 3,
                        background: 'linear-gradient(135deg, #ff416c 0%, #4facfe 50%, #00f2fe 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 700,
                        fontSize: { xs: '20px', md: '24px' },
                        letterSpacing: '1px'
                    }}
                >
                    Live Preview
                </Typography>

                <Divider sx={{ mb: 3, borderColor: 'rgba(0, 242, 254, 0.2)' }} />

                <Box
                    sx={{
                        width: '100%',
                        minHeight: 400,
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(0, 242, 254, 0.2)'
                    }}
                >
                    <iframe
                        title="preview"
                        sandbox="allow-scripts"
                        srcDoc={`<style>${css}</style>${html}`}
                        style={{ width: '100%', height: 400, border: 'none' }}
                    />
                </Box>
            </Paper>
        </Box>
    );
}

export default Home;