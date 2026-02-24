import connectToDatabase from "../../../../_database/mongodb";
import Users from "../../../../schemas/Users";
import { NextResponse } from "next/server";

export async function GET(request) {
  const filter = request.nextUrl?.searchParams.get("filter");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  let matchCondition = {};
  let groupBy;

  const roleColors = {
    lot1: "#1f77b4",
    lot2: "#ff7f0e",
    lot3: "#2ca02c",
    lot4: "#d62728",
    lot5: "#9467bd",
    lot6: "#8c564b",
    lot7: "#e377c2",
    lot8: "#7f7f7f",
    lot9: "#bcbd22",
    lot10: "#17becf",
    lot11: "#393b79",
    lot12: "#637939",
    lot13: "#8c6d31",
    lot14: "#843c39",
    lot15: "#7b4173"
  };

  try {
    switch (filter) {
      case "year":
        groupBy = { period: { $year: "$createdAt" } };
        matchCondition = { role: { $ne: "superAdmin" } };
        break;
      case "month":
        groupBy = { period: { $month: "$createdAt" } };
        matchCondition = {
          role: { $ne: "superAdmin" },
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1),
          },
        };
        break;
      case "week":
        groupBy = {
          period: {
            $floor: {
              $divide: [{ $dayOfMonth: "$createdAt" }, 7],
            },
          },
        };
        matchCondition = {
          role: { $ne: "superAdmin" },
          createdAt: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1),
          },
        };
        break;
      default:
        throw new Error("Invalid filter");
    }

    await connectToDatabase();

    const [roleCounts, data] = await Promise.all([
      Users.aggregate([
        { $match: matchCondition },
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]),
      Users.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: { role: "$role", period: groupBy.period },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.period": 1 } },
      ]),
    ]);

    const roleCountsObject = {
      allUsers: 0,
      lot1: 0,
      lot2: 0,
      lot3: 0,
      lot4: 0,
      lot5: 0,
      lot6: 0,
      lot7: 0,
      lot8: 0,
      lot9: 0,
      lot10: 0,
      lot11: 0,
      lot12: 0,
      lot13: 0,
      lot14: 0,
      lot15: 0
    };

    roleCounts.forEach(({ _id, count }) => {
      roleCountsObject.allUsers += count;
      if (roleCountsObject.hasOwnProperty(_id)) {
        roleCountsObject[_id] = count;
      }
    });

    const formattedData = {
      labels: [],
      datasets: [],
    };

    const periods = new Set();
    const roleData = {};

    data.forEach(({ _id: { role, period }, count }) => {
      const periodLabel =
        filter === "year"
          ? `${period}`
          : filter === "month"
          ? new Date(currentYear, period - 1).toLocaleString("default", {
              month: "short",
            })
          : `Week ${period + 1}`;

      periods.add(periodLabel);

      if (!roleData[role]) {
        roleData[role] = {
          label: role,
          data: [],
          backgroundColor: roleColors[role] || "#000000",
        };
      }

      roleData[role].data.push({
        period: periodLabel,
        count,
      });
    });

    formattedData.labels = Array.from(periods).sort();

    Object.keys(roleData).forEach((role) => {
      const valArray = new Array(formattedData.labels.length).fill(0);
      roleData[role].data.forEach(({ period, count }) => {
        const index = formattedData.labels.indexOf(period);
        if (index > -1) {
          valArray[index] = count;
        }
      });
      roleData[role].data = valArray;
    });

    formattedData.datasets = Object.values(roleData).sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    return NextResponse.json({
      userCount: roleCountsObject,
      users: formattedData,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
