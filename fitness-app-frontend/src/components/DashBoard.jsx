
import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { AuthContext } from "react-oauth2-code-pkce";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function Dashboard() {
  const { tokenData } = useContext(AuthContext);
  const userId = tokenData?.sub;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("Today");

  const today = new Date().toISOString().split("T")[0]; 

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setData(null);

    let queryParamKey = "date";
    let queryParamValue = today;

    if (range === "Monthly") {
      queryParamKey = "month";
      queryParamValue = today.slice(0, 7);
    }

    fetch(
      `http://localhost:8080/dashboardservice/api/dashboard/${range}?userId=${userId}&${queryParamKey}=${queryParamValue}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, today, range]);

  
  const CountUpNumber = ({ value }) => {
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) =>
      Math.round(latest).toLocaleString()
    );

    useEffect(() => {
      const controls = animate(motionValue, value, {
        duration: 0.8, 
        ease: "easeOut",
      });
      return controls.stop;
    }, [value]);

    return <motion.span>{rounded}</motion.span>;
  };

  
  const getDurationByActivity = () => {
    if (!data?.activities) return {};
    return data.activities.reduce((acc, act) => {
      acc[act.type] = (acc[act.type] || 0) + act.duration;
      return acc;
    }, {});
  };

  const durationByActivity = getDurationByActivity();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(to bottom, #fafafa, #fff)",
        minHeight: "100vh",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
          position: "relative",
          display: "inline-block",
        }}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Fitness Overview —{" "}
        {range === "Today"
          ? "Today"
          : range === "Weekly"
          ? "Weekly"
          : "Monthly"}
        <Box
          sx={{
            height: 4,
            background: "linear-gradient(90deg, #1DB954, #ff9800)",
            borderRadius: 2,
            mt: 1,
          }}
        />
      </Typography>

      {/* Range Selector */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Range</InputLabel>
          <Select
            value={range}
            label="Range"
            onChange={(e) => setRange(e.target.value)}
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="Weekly">Week</MenuItem>
            <MenuItem value="Monthly">Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : !data ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" color="error">
            No data available
          </Typography>
        </Box>
      ) : (
        <>
          {/* Stat Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* Calories Burned */}
            <Card
              component={motion.div}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                borderRadius: 4,
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #1DB954 0%, #191414 100%)",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <LocalFireDepartmentIcon /> Calories Burned
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                  <CountUpNumber value={data.totalCalories} />{" "}
                  <Typography component="span" variant="subtitle1">
                    cal
                  </Typography>
                </Typography>
              </CardContent>
            </Card>

            {/* Workout Duration */}
            <Card
              component={motion.div}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                borderRadius: 4,
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                background: "linear-gradient(135deg, #ff9800 0%, #e65100 100%)",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ display: "flex", gap: 1 }}>
                  <AccessTimeIcon /> Workout Duration
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                  <CountUpNumber value={data.totalDuration} />{" "}
                  <Typography component="span" variant="subtitle1">
                    min
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Activity Breakdown */}
          <Box sx={{ mt: 5 }}>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: "bold" }}
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Activity Breakdown
              <Box
                sx={{
                  height: 3,
                  width: 200,
                  background: "linear-gradient(90deg, #1DB954, #ff9800)",
                  borderRadius: 2,
                  mt: 1,
                }}
              />
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              {Object.entries(data.caloriesByActivity).map(
                ([activity, calories], idx) => (
                  <Card
                    key={activity}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    sx={{
                      borderRadius: 4,
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      background: "#f9f9f9",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {activity.replace("_", " ")}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        <CountUpNumber value={calories} /> cal •{" "}
                        <CountUpNumber value={durationByActivity[activity] || 0} />{" "}
                        min
                      </Typography>
                    </CardContent>
                  </Card>
                )
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Dashboard;
