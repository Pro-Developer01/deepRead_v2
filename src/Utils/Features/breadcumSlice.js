import { createSlice } from '@reduxjs/toolkit'

export const breadcumSlice = createSlice({
    name: 'breadcumSlice',
    initialState: {
        value: []
    },
    reducers: {
        updateBreadcumArray: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateBreadcumArray } = breadcumSlice.actions

export default breadcumSlice.reducer