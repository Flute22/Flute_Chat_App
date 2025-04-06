import { create } from "zustand";
import { createAuthSlice } from "./slices/auth.slice";
import { createChatSlice } from "./slices/chat-slice";

export const userAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
})) 