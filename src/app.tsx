import Layout from "@/layout";
import Home from "@/pages/Home";
import ActivityLiveData from "@/pages/ActivityLiveData";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="activity-live-data" element={<ActivityLiveData />} />
      </Route>
    </Routes>
  );
}
