import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { loadState, saveState } from "./utils/localStorage";
const initialState = loadState() === undefined ? {} : loadState();

const middleware = [thunk];

export const giveMeStore = () => {
  let store;
  try {
    store = createStore(
      rootReducer,
      initialState.user,
      compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    );
  } catch (error) {
    store = createStore(
      rootReducer,
      initialState.user,
      compose(applyMiddleware(...middleware))
    );
  }

  //user contains the TOKEN
  store.subscribe(() => {
    saveState({
      user: store.getState()
    });
  });
  return store;
};

export default giveMeStore;
