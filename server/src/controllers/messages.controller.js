import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/messages.model.js";

const getMessages = asyncHandler( async ( req, res ) => {
    const user1 = req.user._id;
    const user2 = req.body._id;

    if ( !user1 || !user2 ) {
        throw new ApiError(400, "Both User IDs are required");
    }

    const message = await Message.find({
        $or: [
            { sender: user1, recipient: user2 },
            { sender: user2, recipient: user1 },
        ],
    }).sort({ timestamp: 1 });

    return res
        .status(200)
        .json(new ApiResponse(200, message, "Messages fetched successfully"));
})

export { getMessages };
