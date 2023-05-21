import { createSlice } from '@reduxjs/toolkit'

export const ideacardSlice = createSlice({
    name: 'ideacardData',
    initialState: {
        value: null
    },
    reducers: {
        updateIdeacardData: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateIdeacardData } = ideacardSlice.actions

export default ideacardSlice.reducer