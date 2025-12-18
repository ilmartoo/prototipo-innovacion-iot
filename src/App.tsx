import Layout from "@/Layout";
import ActivityDetail from "@/pages/ActivityDetail";
import CreateActivity from "@/pages/CreateActivity";
import Home from "@/pages/Home";
import MyActivities from "@/pages/MyActivities";
import MyProfile from "@/pages/MyProfile";
import Rankings from "@/pages/Rankings";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="activity/:activity" element={<ActivityDetail />} />
        <Route path="create-activity" element={<CreateActivity />} />
        <Route path="my-activities" element={<MyActivities />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="rankings" element={<Rankings />} />
      </Route>
    </Routes>
  );
}
