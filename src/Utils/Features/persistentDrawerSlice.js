import { createSlice } from '@reduxjs/toolkit'

export const persistentDrawerSlice = createSlice({
    name: 'persistentDrawerSlice',
    initialState: {
        value: null
    },
    reducers: {
        updatePersistentDrawer: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updatePersistentDrawer } = persistentDrawerSlice.actions

export default persistentDrawerSlice.reducer