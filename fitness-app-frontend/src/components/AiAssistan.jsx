
import { useState, useContext, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { AuthContext } from "react-oauth2-code-pkce";
import SmartToyIcon from "@mui/icons-material/SmartToy";

function AiAssistant() {
  const { tokenData } = useContext(AuthContext);
  const userId = tokenData?.sub;
  const userName = tokenData?.preferred_username || "You";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const chatEndRef = useRef(null);

  // auto-scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: userName, text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    
    const typingMessage = { sender: "FitBot", text: "typing", typing: true };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const resPromise = fetch("http://localhost:8080/ai-service/api/recommendation/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          question: userMessage.text,
          userId,
          date: today,
        }),
      }).then((res) => res.json());

      
      const [data] = await Promise.all([
        resPromise,
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);

      setMessages((prev) => [
        ...prev.filter((msg) => !msg.typing),
        { sender: "FitBot", text: data?.answer || "Sorry I can't answer,Please try later" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.typing),
        { sender: "FitBot", text: "Sorry I can't answer" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "linear-gradient(to bottom, #f0f4f8, #ffffff)",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "600px",
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "#1DB954",
            color: "white",
          }}
        >
          <Avatar sx={{ bgcolor: "white", color: "#1DB954" }}>
            <SmartToyIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            FitBot
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Your AI fitness coach
          </Typography>
        </Box>

        {/* Chat Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            bgcolor: "#fafafa",
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: msg.sender === userName ? "flex-end" : "flex-start",
              }}
            >
              {msg.typing ? (
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "20px",
                    bgcolor: "#e0e0e0",
                    display: "flex",
                    gap: "4px",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#555",
                        display: "inline-block",
                      }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "20px",
                    background:
                      msg.sender === userName ? "#1DB954" : "#e0e0e0",
                    color: msg.sender === userName ? "white" : "black",
                    maxWidth: "70%",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.text}
                </Typography>
              )}
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ display: "flex", gap: 2, p: 2, borderTop: "1px solid #ddd" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask FitBot something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            sx={{ borderRadius: "20px" }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1DB954",
              "&:hover": { bgcolor: "#17a74a" },
              borderRadius: "20px",
            }}
            onClick={handleSend}
            disabled={loading}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AiAssistant;
