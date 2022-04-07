import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";

export const history = createBrowserHistory();

// reducer 추가하기
const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  router: connectRouter(history),
});

//const middlewares = [thunk];
const middlewares = [thunk.withExtraArgument({history: history})];

// 지금이 어느 환경인 지 알려줌. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는걸 사용.
if (env === "development") {
  // import 안한 이유 ? logger라는건 콘솔에 찍히는것. 배포버전에는 들어갈 필요가 없음
  // 그래서 require을 사용
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// Redux dev tools 사용하기 위한 코드
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middlewares));


let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();