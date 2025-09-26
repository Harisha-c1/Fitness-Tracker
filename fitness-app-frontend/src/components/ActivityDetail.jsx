
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivityDetail } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { motion } from "framer-motion";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    let timeoutId;

    const fetchActivityDetail = async () => {
      try {
       
        timeoutId = setTimeout(() => {
          setTimeoutReached(true);
        }, 10000);

        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);

    
        clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error fetching activity detail:", error);
        clearTimeout(timeoutId);
        setTimeoutReached(true);
      }
    };

    fetchActivityDetail();

    return () => clearTimeout(timeoutId); 
  }, [id]);

  // --- Timeout fallback ---
  if (timeoutReached && !activity) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <WarningAmberIcon color="error" sx={{ fontSize: 50 }} />
        <Typography variant="h6" sx={{ color: "error.main", fontWeight: "bold" }}>
          Oops! This is taking longer than expected.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Please try again later.
        </Typography>
      </Box>
    );
  }

  // --- Loading spinner ---
  if (!activity) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Spinning Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{
            border: "6px solid rgba(0,0,0,0.1)",
            borderTop: "6px solid #1976d2",
            borderRadius: "50%",
            width: 60,
            height: 60,
          }}
        />

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Loading your activity...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  // --- Activity content ---
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      {/* Activity Info */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: 3,
          background: "linear-gradient(135deg, #f5f7fa, #e4ebf0)",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Activity Details
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
            <Chip
              label={`Type: ${activity.activityType}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Date: ${new Date(activity.creationDate).toLocaleDateString()}`}
              color="secondary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendation && (
        <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#fafafa" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              AI Recommendations
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ textAlign: "justify", mb: 2 }}
            >
              Based on your activity, here are some personalized recommendations:
            </Typography>
            <Typography sx={{ fontStyle: "italic", textAlign: "justify", mb: 2 }}>
              {activity.recommendation}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "success.main", fontWeight: "bold" }}
            >
              Improvements
            </Typography>
            <List dense>
              {activity?.improvements.map((improvement, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={improvement}
                    primaryTypographyProps={{ textAlign: "justify" }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "warning.main", fontWeight: "bold" }}
            >
              Suggestions
            </Typography>
            <List dense>
              {activity?.suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <LightbulbOutlinedIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion}
                    primaryTypographyProps={{ textAlign: "justify" }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "error.main", fontWeight: "bold" }}
            >
              Safety Guidelines
            </Typography>
            <List dense>
              {activity?.safety.map((safety, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <WarningAmberIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={safety}
                    primaryTypographyProps={{ textAlign: "justify" }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
