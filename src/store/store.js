import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducer';
import rootSaga from './saga';

const sagaMiddleWare = createSagaMiddleware();
const middleWares = [];
middleWares.push(sagaMiddleWare);

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(...middleWares)));

export default store;
sagaMiddleWare.run(rootSaga);
