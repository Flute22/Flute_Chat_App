import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/messages.model.js";

const searchContacts = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
        throw new ApiError(400, "Search term is required");
    }

    const sanitizedSearchTerm = searchTerm.replace(
        /[.*.+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
        $and: [
            {
                _id: { $ne: req.user._id },
            },

            {
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex },
                ],
            },
        ],
    });
    
    return res
        .status(200)
        .json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
});

const getContactsForDMList = asyncHandler(async (req, res) => {
    let userId = req.user._id;
   
    userId = new mongoose.Type.ObjectId(userId);

    const contacts = await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: userId },
                    { recipient: userId },
                ],
            },
        },

        {
            $sort: { timestamp: -1 },
        },

        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ["$sender", userId]},
                        then: $recipient,
                        else: $sender,
                    },
                },

                lastMessageTime: { $first: "$timestamp" },
            },
        },

        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id", 
                as: "contactInfo",
            },
        },

        {
            $unwind: "$contactInfo",
        },

        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                email: "$contactInfo.email",
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                image: "$contactInfo.image",
                color: "$contactInfo.color",
            },
        },

        {
            $sort: { lastMessageTime: -1 },
        },
    
    ]);

    
    return res
        .status(200)
        .json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
});


export { searchContacts, getContactsForDMList };
