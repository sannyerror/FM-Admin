import { createStore , applyMiddleware } from 'redux' 
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { rootReducer }  from './rootReducer' 
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig = {
    key: 'First-match',
    storage,
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer)
 export default (store, persistor)=>{
store  = createStore(persistedReducer ,composeWithDevTools(applyMiddleware( thunk,logger)) );
persistor = persistStore(store)
return { store , persistor}
  }

