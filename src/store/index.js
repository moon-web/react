import { applyMiddleware, createStore } from 'redux'
import ReduxThunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducer'

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore);
const initState = {};
const store = createStoreWithMiddleware(rootReducer, initState);

export default store;