export const createChatSlice = ( set, get ) => (
    {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],

        setSelectChatType: ( selectedChatType ) => set({ selectedChatType }),
        setSelectChatData: ( selectedChatData ) => set({ selectedChatData }),
        setSelectedChatMessages: ( selectedChatMessages ) => set({ selectedChatMessages }),    

        closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [] })
    }
);