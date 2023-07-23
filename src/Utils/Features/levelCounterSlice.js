import { createSlice, current } from '@reduxjs/toolkit'

export const levelCounterSlice = createSlice({
    name: 'levelCounter',
    initialState: {
        value: 1,
        currentLevel:
        {
            label: "1st Level:Chapter",
            value: 1
        },
    },
    reducers: {
        updateLevelCounter: (state, action) => {
            state.value = action.payload
        },
        updateSelectedLevel: (state, action) => {
            state.currentLevel = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateLevelCounter, updateSelectedLevel } = levelCounterSlice.actions

export default levelCounterSlice.reducer