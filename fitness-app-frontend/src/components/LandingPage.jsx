

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "react-oauth2-code-pkce";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TimelineIcon from "@mui/icons-material/Timeline";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import register from "./RegisterForm";

export default function LandingPage() {
  const { token, tokenData } = useContext(AuthContext);
  const username =
    tokenData?.username ||
    tokenData?.given_name ||
    tokenData?.name ||
     null;

  const circleItems = [
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 44, color: "#ffffff" }} />,
      title: "Calories Burned",
      text: "Accurate calorie tracking per exercise type — know how many calories each activity burns.",
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 44, color: "#ffffff" }} />,
      title: "Duration Tracking",
      text: "Log workout duration by activity type — see how long you train and where to improve.",
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 44, color: "#ffffff" }} />,
      title: "AI Coaching",
      text: "Get smart recommendations based on your past activities and trends.",
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 44, color: "#ffffff" }} />,
      title: "Progress Insights",
      text: "Visualize progress across calories and duration with actionable insights.",
    },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.paper" }}>
      {/* ---------- HERO ---------- */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(6, 95, 70, 0.95) 0%, rgba(8, 36, 62, 0.95) 60%)",
          color: "white",
          py: { xs: 8, md: 14 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    lineHeight: 1.05,
                    fontSize: { xs: "1.8rem", md: "3rem" },
                  }}
                >
                  Transform your fitness. Track calories. Measure time. Train
                  smarter.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    mb: 4,
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  Fitness Tracker collects duration & calorie data per exercise
                  type and uses AI to give you personalized insights that move
                  results faster.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {token ? (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Hi, {username}
                      </Typography>
                      <Button
                        component={Link}
                        to="/activities"
                        variant="text"
                        sx={{ color: "white" }}
                      >
                        Explore Activities
                      </Button>
                    </>
                  ) : (
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      size="large"
                      sx={{
                        px: { xs: 3, md: 4 },
                        py: 1.25,
                        borderRadius: 3,
                        background: "linear-gradient(90deg,#1DB954,#1ed760)",
                        boxShadow: "0 8px 30px rgba(29,185,84,0.18)",
                      }}
                    >
                      Register Now
                    </Button>
                  )}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                    backdropFilter: "blur(6px)",
                    color: "white",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Fast Summary
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Log activities quickly, view daily calorie & duration totals,
                    and let our AI suggest improvements.
                  </Typography>
                  <Divider
                    sx={{ my: 2, borderColor: "rgba(255,255,255,0.06)" }}
                  />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        700
                      </Typography>
                      <Typography variant="caption">cal/day</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        45
                      </Typography>
                      <Typography variant="caption">mins</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ---------- CIRCULAR FEATURES + SVG PATH ---------- */}
<Box
      sx={{
        py: { xs: 5, md: 6 },
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Heading */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 800,
            mb: { xs: 3, md: 4 },
            fontSize: { xs: "1.6rem", md: "2rem" },
          }}
        >
          What we TRACK
        </Typography>

        {/* Circles Grid */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            minHeight: { xs: 300, sm: 340, md: 260 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pb: { xs: 2, md: 3 },
          }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            {circleItems.map((c, idx) => (
              <Grid item xs={12} sm={6} md={3} key={c.title}>
                <motion.div
                  whileHover={{ scale: 1.06, translateY: -6 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 * idx, duration: 0.6 }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      mx: "auto",
                      width: { xs: 140, md: 160 },
                      height: { xs: 140, md: 160 },
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#0b1720",
                      color: "white",
                      textAlign: "center",
                      boxShadow: "0 12px 30px rgba(2,20,15,0.18)",
                      p: 2,
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                      }}
                    >
                      {c.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "0.85rem", md: "1rem" },
                      }}
                    >
                      {c.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        maxWidth: 120,
                        mt: 0.5,
                        color: "rgba(255,255,255,0.8)",
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                      }}
                    >
                      {c.text}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Motivational Thought */}
        <Typography
          align="center"
          sx={{
            mt: { xs: 3, md: 4 },
            fontStyle: "italic",
            fontWeight: 500,
            color: "#063302ff",
            fontSize: { xs: "0.9rem", md: "1.1rem" },
          }}
        >
          "Every rep, every step, every choice builds the strongest version of you."
        </Typography>
      </Container>
    </Box>
  

       {/* ---------- IMPORTANCE OF FITNESS ---------- */}
       <Box sx={{ py: 12, background: "linear-gradient(180deg,#f6f9fc,#fff)"  }}>
       <Container maxWidth="lg" >
     <Grid container spacing={6} alignItems="center">
       {/* LEFT SIDE - TEXT */}
       <Grid item xs={12} md={5}>
         <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>           Why fitness matters — beyond looks
         </Typography>
         <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
           Regular physical activity improves your cardiovascular health, strengthens muscles,
           helps manage weight, improves mood, and increases longevity. Tracking calories and
           duration provides objective feedback so you can adjust intensity and frequency —
           that’s how real progress is built.
         </Typography>

         <Box sx={{ display: "grid", gap: 1.25 }}>
           <Typography variant="subtitle1">• Consistency beats intensity</Typography>
           <Typography variant="subtitle1">• Small daily wins compound over time</Typography>
           <Typography variant="subtitle1">• Data removes guesswork from training</Typography>
         </Box>
       </Grid>
       {/* RIGHT SIDE - BENEFIT CARDS */}
       <Grid item xs={12} md={7} >
         <Grid container spacing={3}>
            {[
            {
              title: "Heart Health",
              desc: "Improves cardiovascular endurance & lowers risk of disease.",
              color: "#e53935",
              icon: "❤️",
            },
            {
              title: "Mental Wellbeing",
              desc: "Exercise reduces stress, anxiety, and boosts mood naturally.",
              color: "#3949ab",
              icon: "🧘",
            },
            
            {
              title: "Strength & Energy",
              desc: "Builds muscle, increases stamina, and keeps you energized.",
              color: "#43a047",
              icon: "⚡",
            },
            {
              title: "Longevity",
              desc: "Active people live longer, healthier lives with better quality.",
              color: "#fb8c00",
              icon: "⏳",
            },
          ].map((c, idx) => (
            <Grid item xs={12} sm={6} key={c.title} >
              <motion.div
                whileHover={{ scale: 1.05, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${c.color}15, #fff)`,
                    boxShadow: `0 6px 20px ${c.color}30`,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ mb: 1, color: c.color, fontWeight: 800 }}
                  >
                    {c.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {c.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </Container>
</Box>


       {/* ---------- CTA ---------- */}
      <Box sx={{ py: 8, textAlign: "center", background: "#f9f9f9" }}>
        <Container maxWidth="md">
    {token ? (
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Hi, {username}! Welcome back.
      </Typography>
    ) : (
      <>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Ready to start tracking smarter?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Register now and get personalized insights from day one.
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.4,
            borderRadius: 3,
            background: "linear-gradient(90deg,#1DB954,#1ed760)",
            boxShadow: "0 10px 30px rgba(29,185,84,0.18)",
          }}
        >
          Create Account
        </Button>
      </>
    )}
  </Container>
</Box>

      {/* ---------- FOOTER ---------- */}
      <Box sx={{ bgcolor: "#0b1220", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Fitness Tracker
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}>
                Track calories and duration, get AI recommendations, and visualize progress — all in one place.
              </Typography>
               <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}>
                Designed By Harish
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Box sx={{ display: "inline-flex", gap: 1 }}>
                <IconButton size="small" sx={{ color: "white" }} aria-label="facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "white" }} aria-label="twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "white" }} aria-label="instagram">
                  <InstagramIcon />
                </IconButton>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Link to="/about" style={{ color: "rgba(255,255,255,0.85)", marginRight: 12, textDecoration: "none" }}>
                  About
                </Link>
                <Link to="/privacy" style={{ color: "rgba(255,255,255,0.85)", marginRight: 12, textDecoration: "none" }}>
                  Privacy
                </Link>
                <Link to="/contact" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>
                  Contact
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ background: "rgba(255,255,255,0.04)", my: 3 }} />

          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            © {new Date().getFullYear()} Fitness Tracker — All rights reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}









