import {FETCH_POS_TERMINALS, LOADING_TERMINALS} from 'actions/types';

const INITIAL_STATE = {
    terminals: null,
    loading_terminals: null
}

const posTerminalsReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_POS_TERMINALS:
            return {
                ...state,
                terminals: action.payload
            };
            case LOADING_TERMINALS:
            return {
                ...state,
                loading_terminals: action.payload
            };

        default:
        return state;
    }
}

export default posTerminalsReducer;
