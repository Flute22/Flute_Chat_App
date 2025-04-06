import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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

export { searchContacts };
