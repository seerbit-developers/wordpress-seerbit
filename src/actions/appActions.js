import {BLOCK_UI,LANGUAGE} from "./types";


export const appBusy = (status=false, message='') => (dispatch, getState) => {
    dispatch(
        {
            type: BLOCK_UI,
            payload: {status:status, message:message}
        }
    )
}

