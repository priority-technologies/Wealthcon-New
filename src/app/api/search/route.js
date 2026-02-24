import { adminRoles } from "../../../helpers/constant";
import Notes from "../../../schemas/Notes";
import Videos from "../../../schemas/Videos";
import Gallary from "../../../schemas/Gallary";
import { NextResponse } from 'next/server';
import connectToDatabase from "../../../_database/mongodb";

const fetchData = async (model, query, projection, limit = 10) => {
    return model.find(query, projection).limit(limit).exec();
};

export async function POST(request) {
    const loggedUserRole = request.headers.get("x-user-role");
    try {
        await connectToDatabase();

        const reqBody = await request.json();
        const searchValue = reqBody?.search?.toLowerCase();

        if (!searchValue) {
            return NextResponse.json(
                { error: "Please provide a valid search value." },
                { status: 400 }
            );
        }

        const regex = new RegExp(searchValue, 'i');

        const roles = loggedUserRole === 'admin' || loggedUserRole === 'superAdmin'
            ? adminRoles
            : loggedUserRole
                ? ['all', loggedUserRole]
                : ['all'];

        const commonQuery = {
            studentCategory: { $in: roles },
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ],
        };

        const galleryQuery = {
            studentCategory: { $in: roles },
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        };

        const projection = {
            _id: 1,
            title: 1,
            thumbnail: 1,
        };

        const galleryProjection = {
            _id: 1,
            title: 1,
            image: 1,
        };

        const [videos, notes, charts] = await Promise.all([
            fetchData(Videos, commonQuery, projection),
            fetchData(Notes, commonQuery, projection),
            fetchData(Gallary, galleryQuery, galleryProjection),
        ]);

        // Combine results
        const allData = {
            videos,
            notes,
            charts
        };

        return NextResponse.json({ data: allData });
    } catch (error) {
        console.error("Error while processing search:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
