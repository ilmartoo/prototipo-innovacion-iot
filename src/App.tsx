import Layout from "@/Layout";
import ActivityLiveData from "@/pages/ActivityLiveData";
import Home from "@/pages/Home";
import MyActivities from "@/pages/MyActivities";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="activity/:activity">
          <Route path="live" element={<ActivityLiveData />} />
          {/* <Route path="/review" element={<ActivityReviewData />} /> */}
        </Route>
        <Route path="/my-activities" element={<MyActivities />} />
        {/* <Route path="/my-profile" element={<MyProfile />}/> */}
        {/* <Route path="/rakings" element={<Rankings />}/> */}
      </Route>
    </Routes>
  );
}
