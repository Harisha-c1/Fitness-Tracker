import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { getActivities, deleteActivity } from "../services/api";
import { useNavigate } from "react-router-dom";

const activityImages = {
  RUNNING: "/images/running.jpg",
  CYCLING: "/images/cycling.jpg",
  YOGA: "/images/yoga.jpg",
  SWIMMING: "/images/swim.jpg",
  WALKING: "/images/walking.jpg",
  CARDIO: "/images/cardio.jpg",
  WEIGHT_TRAINING: "/images/weightlifting.jpg",
  OTHER: "/images/other.jpg",
  DEFAULT: "/images/other.jpg",
};

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deletingId, setDeletingId] = useState(null);
  const mountedRef = useRef(true);
  const navigate = useNavigate();

  // fetch activities (sorted newest first by createdAt)
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getActivities();
      const data = Array.isArray(res.data) ? res.data : [];
      
      data.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (aTime && bTime) return bTime - aTime;
        
        if (!isNaN(Number(b.id)) && !isNaN(Number(a.id))) return Number(b.id) - Number(a.id);
        return 0;
      });
      if (!mountedRef.current) return;
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setSnackbar({ open: true, message: "Failed to load activities", severity: "error" });
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchActivities();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchActivities]);

  
  const handleConfirmDelete = async () => {
    if (!selectedActivity) return;
    const activityId = selectedActivity.id;
    const userId = selectedActivity.userId;
    const prev = [...activities];
    setActivities((prevList) => prevList.filter((a) => a.id !== activityId));
    setDeletingId(activityId);
    setOpenConfirm(false);

    try {
      await deleteActivity(activityId, userId);
      setSnackbar({ open: true, message: "Activity deleted successfully", severity: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      setActivities(prev);
      setSnackbar({ open: true, message: "Failed to delete activity", severity: "error" });
    } finally {
      setDeletingId(null);
      setSelectedActivity(null);
    }
  };

  const handleDeleteClick = (event, activity) => {
    event.stopPropagation();
    setSelectedActivity(activity);
    setOpenConfirm(true);
  };

  const filteredActivities = filterType === "ALL" ? activities : activities.filter((a) => a.type === filterType);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: { xs: "24px 16px", md: "40px 32px" },
        background: "linear-gradient(135deg, #39d9a1ee, #6737c6ff)",
      }}
    >
      {/* Header */}
      <Typography variant="h4" align="center" color="white" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        My Fitness Activities
      </Typography>

      {/* Filter */}
      <Box display="flex" justifyContent="flex-end" mb={4} pr={4}>
        <FormControl
          sx={{
            minWidth: 220,
            borderRadius: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,
              
              "& fieldset": { borderColor: "rgba(0, 0, 0, 2)" },
              "&:hover fieldset": { borderColor: "#cbb8ff" },
              "&.Mui-focused fieldset": { borderColor: "#a88bff", borderWidth: 2 },
              backgroundColor: "rgba(255,255,255,0.9)",
            },
            "& .MuiInputLabel-root": {
              color: "black",
              fontSize: 20,
              fontWeight: "bold",
            },
            "& .MuiSelect-select": {
              color: "#1a1a1a",
              fontWeight: 500,
            },
            boxShadow: 2,
          }}
        >
          <InputLabel>Filter by Type</InputLabel>
          <Select value={filterType} label="Filter by Type" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
            <MenuItem value="YOGA">Yoga</MenuItem>
            <MenuItem value="SWIMMING">Swimming</MenuItem>
            <MenuItem value="WALKING">Walking</MenuItem>
            <MenuItem value="CARDIO">Cardio</MenuItem>
            <MenuItem value="WEIGHT_TRAINING">Weight Training</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading overlay while fetching */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredActivities.length === 0 ? (
            <Grid item xs={12} sm={8} md={3} lg={2}>
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    padding: "30px",
                    textAlign: "center",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    boxShadow: 6,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    🚀 No activities found!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adding activities or change your filter 💪
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ) : (
            filteredActivities.map((activity, index) => (
              <Grid item xs={12} sm={6} md={3} lg={2.8} key={activity.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.32 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: 6,
                      maxWidth:180,
                      backgroundColor: "rgba(255,255,255,0.98)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    role="button"
                    aria-label={`Open ${activity.type} activity details`}
                  >
                    {/* Delete Button */}
                    <IconButton
                      aria-label={`delete ${activity.type}`}
                      sx={{ position: "absolute", top: 8, right: 8, zIndex: 5, bgcolor: "rgba(255,255,255,0.1)",        
                                "&:hover": { bgcolor: "rgba(255,255,255,0.5)" },  }}
                      onClick={(e) => handleDeleteClick(e, activity)}
                      disabled={deletingId === activity.id}
                    >
                      {deletingId === activity.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon color="error" />
                      )}
                    </IconButton>

                    <CardMedia
                      component="img"
                      height="160"
                      
                      image={activityImages[activity.type] || activityImages["DEFAULT"]}
                      alt={activity.type}
                       
                    />
                    <CardContent  sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                        {activity.type.replace("_", " ")}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 0.5, flexDirection:"column" }}>
                        <Typography variant="caption">⏱ Duration: <strong>{activity.duration} min</strong></Typography>
                        <Typography variant="caption">🔥Calories: <strong>{activity.caloriesBurned}</strong></Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }} noWrap>
                        {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ""}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-desc"
      >
        <DialogTitle id="confirm-delete-title">Delete activity</DialogTitle>
        <DialogContent>
          <Typography id="confirm-delete-desc">
            Are you sure you want to delete{" "}
            <strong>{selectedActivity ? selectedActivity.type.replace("_", " ") : ""}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            aria-label="confirm delete"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
