import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="p-6">
      <Link to="/activity-live-data">
        <Button>View Activity Live Data</Button>
      </Link>
    </div>
  );
}