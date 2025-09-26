import { Box, Button, duration,Card,CardContent,Typography, FormControl, InputLabel, Menu, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { addActivity } from '../services/api';      

const ActivityForm=({onActivityAdded})=>{
    const [activity, setActivity] = React.useState({type:"RUNNING",duration: '',caloriesBurned: '',additionalMetrics: {} });
    const [loading, setLoading] = React.useState(false);
    const handleSubmit=async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
       await addActivity(activity);
        onActivityAdded();
        setActivity({type:"RUNNING",duration: '',caloriesBurned: '' });
    }catch(error){
        console.error("Error adding activity:", error); 
  }finally{
      setLoading(false);
  }
}

    return (
    <Card
      sx={{
        mb: 5,
        borderRadius: 3,
        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        background: "linear-gradient(135deg, #FFFFFF 0%, #fce4ec 100%)",
        border: "1px solid #4CAF50",
      }}>
       <CardContent>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2"
          }}
        >Add New Activity</Typography>



        <Box component="form" onSubmit={handleSubmit} >
            {/* Activity Type */}
            <FormControl fullWidth sx={{mb:2}}>
                <InputLabel>Activity Type</InputLabel><br />
                    <Select value={activity.type} onChange={(e)=>setActivity({...activity,type:e.target.value})}   sx={{
                "&:hover": { borderColor: "#1976d2" },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& > fieldset": { borderColor: "#1976d2" }
                }
              }}>
                     <MenuItem value="RUNNING">Running</MenuItem>
                     <MenuItem value="CYCLING">Cycling</MenuItem>
                     <MenuItem value="SWIMMING">Swimming</MenuItem>
                     <MenuItem value="WEIGHT_TRAINING">Weight_Lifting</MenuItem>
                     <MenuItem value="YOGA">Yoga</MenuItem>
                     <MenuItem value="WALKING">Walking</MenuItem>
                     <MenuItem value="CARDIO">Cardio</MenuItem>
                     <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
            </FormControl>
            <TextField fullWidth label="Duration (Minutes)" type='number' required sx={{mb:2}} value={activity.duration} onChange={(e)=>setActivity({...activity,duration:e.target.value})}/>
            <TextField fullWidth label="Calories Burned (approx)" type='number' required sx={{mb:2}} value={activity.caloriesBurned} onChange={(e)=>setActivity({...activity,caloriesBurned:e.target.value})}/>
         <Button type='submit' fullWidth variant='contained' disabled={loading} sx={{
              background: "linear-gradient(135deg, #42a5f5 0%, #7e57c2 100%)",
              borderRadius: 2,
              padding: "10px 0",
              fontWeight: "bold",
              color: "White",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                background: "linear-gradient(135deg, #1e88e5 0%, #5e35b1 100%)"
              }
            }} >{loading ? "Adding..." : "Add Activity"}</Button>    
        </Box></CardContent></Card>
    )
}
export default ActivityForm;



