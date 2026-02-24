import connectToDatabase from "../../../../_database/mongodb";
import Users from "../../../../schemas/Users";
import { NextResponse } from "next/server";

export async function GET(request) {
  const filter = request.nextUrl?.searchParams.get("filter");
  try {
    await connectToDatabase();

    const allUsers = await Users.aggregate([
      {
        $match: {
          role: { $ne: "superAdmin" }, // Exclude documents with role "superAdmin"
        },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const getDataForGraph = async (timePeriod) => {
      let groupBy;
      let matchCondition = {};
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // Determine the grouping and matching logic based on the time period
      if (timePeriod === "year") {
        groupBy = {
          period: { $year: "$createdAt" },
        };
        matchCondition = {
          role: { $ne: "superAdmin" },
        };
      } else if (timePeriod === "month") {
        groupBy = {
          period: { $month: "$createdAt" },
        };
        matchCondition = {
          role: { $ne: "superAdmin" },
          createdAt: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        };
      } else if (timePeriod === "week") {
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
            $gte: new Date(currentYear, currentMonth, 1), // Start of the current month
            $lt: new Date(currentYear, currentMonth + 1, 1), // Start of the next month
          },
        };
      }

      // Fetch the aggregated data
      const data = await Users.aggregate([
        {
          $match: matchCondition,
        },
        {
          $group: {
            _id: {
              role: "$role",
              period: groupBy.period,
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.period": 1, // Sort by period (year, month, or week)
          },
        },
      ]);

      // Initialize the response object
      const formattedData = {
        [timePeriod]: [],
        data: [],
      };

      // Gather all unique periods
      const periods = new Set();
      const roleData = {};

      // Process the aggregated data
      data.forEach((item) => {
        const periodLabel =
          timePeriod === "year"
            ? item._id.period
            : timePeriod === "month"
            ? new Date(currentYear, item._id.period - 1).toLocaleString(
                "default",
                {
                  month: "short",
                }
              )
            : item._id.period + 1; // Week number (1, 2, 3, 4)

        periods.add(periodLabel);

        if (!roleData[item._id.role]) {
          roleData[item._id.role] = {
            type: item._id.role,
            val: [],
          };
        }

        roleData[item._id.role].val.push({
          period: periodLabel,
          count: item.count,
        });
      });

      formattedData[timePeriod] = Array.from(periods).sort();

      // Fill in missing periods with 0s
      Object.keys(roleData).forEach((role) => {
        const valArray = new Array(formattedData[timePeriod].length).fill(0);
        roleData[role].val.forEach((entry) => {
          const index = formattedData[timePeriod].indexOf(entry.period);
          if (index > -1) {
            valArray[index] = entry.count;
          }
        });
        roleData[role].val = valArray;
      });

      formattedData.data = Object.values(roleData);

      return formattedData;
    };

    const data = await getDataForGraph(filter);

    return NextResponse.json({ userCount: allUsers, users: data });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
