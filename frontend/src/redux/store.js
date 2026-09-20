import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import itemSlice from "./itemSlice"
import claimSlice from "./claimSlice"
// marketplaceSlice removed (backend no longer provides marketplace endpoints)
import messageSlice from "./messageSlice"


export default configureStore({
    reducer:{
        user:userSlice,
        item:itemSlice,
        claim:claimSlice,
    // marketplace: marketplaceSlice,
        message:messageSlice,
    },
})