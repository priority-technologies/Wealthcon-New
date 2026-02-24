import { useEffect, useState } from "react";
import GraphCard from "../GraphCard";
import Typography from "../Typography";
import UserHistoryChart from "../UserHistoryChart";
import PageLoading from "../Loading/PageLoading";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard({ filter }) {
  const router = useRouter();
  const [userCount, setUserCount] = useState({});
  const [users, setUsers] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/dashboard", {
        params: { filter },
      });
      if (res?.status === 200) {
        setUserCount(res.data.userCount);
        setUsers(res.data.users);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [filter]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="custom_scroll">
      <div className="grid xl:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        <GraphCard
          title="TOTAL USERS"
          value={userCount?.allUsers || 0}
          percentage="11"
        />
        <GraphCard title="LOT 1" value={userCount?.lot1 || 0} percentage="2" />
        <GraphCard title="LOT 2" value={userCount?.lot2 || 0} percentage="18" />
        <GraphCard title="LOT 3" value={userCount?.lot3 || 0} percentage="28" />
        <GraphCard title="LOT 4" value={userCount?.lot4 || 0} percentage="4" />
        <GraphCard title="LOT 5" value={userCount?.lot5 || 0} percentage="11" />
        <GraphCard title="LOT 6" value={userCount?.lot6 || 0} percentage="11" />
        <GraphCard title="LOT 7" value={userCount?.lot7 || 0} percentage="11" />
        <GraphCard title="LOT 8" value={userCount?.lot8 || 0} percentage="11" />
        <GraphCard title="LOT 9" value={userCount?.lot9 || 0} percentage="11" />
        <GraphCard
          title="LOT 10"
          value={userCount?.lot10 || 0}
          percentage="11"
        />
        <GraphCard
          title="LOT 11"
          value={userCount?.lot11 || 0}
          percentage="11"
        />
        <GraphCard
          title="LOT 12"
          value={userCount?.lot12 || 0}
          percentage="11"
        />
        <GraphCard
          title="LOT 13"
          value={userCount?.lot13 || 0}
          percentage="11"
        />
        <GraphCard
          title="LOT 14"
          value={userCount?.lot14 || 0}
          percentage="11"
        />
        <GraphCard
          title="LOT 15"
          value={userCount?.lot15 || 0}
          percentage="11"
        />
      </div>
      <div className="shadow-xl p-5 md:mt-8">
        <Typography
          tag="h4"
          size="text-lg"
          weight="font-semibold"
          color="text-base-content"
          className="block text-left mb-3"
        >
          User History
        </Typography>
        <hr className="mb-3" />
        <UserHistoryChart users={users} />
      </div>
    </div>
  );
}
