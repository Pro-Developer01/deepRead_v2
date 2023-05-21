import { createSlice } from '@reduxjs/toolkit'

export const fetchListviewSlice = createSlice({
    name: 'fetchListviewSlice',
    initialState: {
        value: false
    },
    reducers: {
        updateFetchListviewState: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateFetchListviewState } = fetchListviewSlice.actions

export default fetchListviewSlice.reducer