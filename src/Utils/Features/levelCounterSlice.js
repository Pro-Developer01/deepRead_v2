import { createSlice } from '@reduxjs/toolkit'

export const levelCounterSlice = createSlice({
    name: 'levelCounter',
    initialState: {
        value: 1
    },
    reducers: {
        updateLevelCounter: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateLevelCounter } = levelCounterSlice.actions

export default levelCounterSlice.reducer