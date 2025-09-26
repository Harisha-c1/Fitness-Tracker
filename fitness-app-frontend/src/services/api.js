import axios from "axios";

const API_url = "http://localhost:8080";

const api=axios.create({
    baseURL: API_url
});

api.interceptors.request.use(config => {
    const userId=localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if(userId){
        config.headers["X-User-Id"] = userId;
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

export const getActivities=()=>api.get("/activity-service/api/activities");
export const addActivity=(activity)=>api.post("/activity-service/api/activities",activity).then(res=>console.log("Activity added:", res.data));
export const getActivityDetail=(id)=>api.get(`/ai-service/api/recommendation/activity/${id}`);
export const deleteActivity = (activityId, userId) =>
api.delete(`/activity-service/api/activities/${activityId}/${userId}`);
