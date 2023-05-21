import { createSlice } from '@reduxjs/toolkit'

export const IdentifyIdeaCardSlice = createSlice({
    name: 'IdentifyIdeaCardData',
    initialState: {
        value: null
    },
    reducers: {
        updateIdentifyIdeaCardData: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateIdentifyIdeaCardData } = IdentifyIdeaCardSlice.actions

export default IdentifyIdeaCardSlice.reducer