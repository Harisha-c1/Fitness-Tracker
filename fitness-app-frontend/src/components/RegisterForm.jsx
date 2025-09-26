
import { useState, useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import axios from "axios";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";

function RegisterForm() {
  const { logIn } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ageError, setAgeError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      const ageValue = parseInt(value, 10);
      setAgeError(isNaN(ageValue) || ageValue <= 0);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ageError || formData.age === "") {
      setMessage("❌ Please enter a valid age greater than 0.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await axios.post("http://localhost:8080/user-service/api/users/registerUser", formData);
      setMessage("✅ Registration successful!");

      
      setTimeout(() => {
        logIn();
      }, 1000);
    } catch (err) {
      setMessage("❌ Registration failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.85)",
            width: "100%",
            maxWidth: 420,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              🚀 Create Account
            </Typography>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {[
              { label: "Username", name: "userName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  required
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  variant="outlined"
                />
              </motion.div>
            ))}

          
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <TextField
                margin="normal"
                fullWidth
                required
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                error={ageError}
                helperText={ageError ? "Age must be greater than 0" : ""}
                variant="outlined"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                }}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </motion.div>
          </form>

          {message && (
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: message.includes("✅") ? "green" : "red" }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}

export default RegisterForm;
