// ─────────────────────────────────────────────────────────────────────────────
//  Root Reducer — combines all reducers using combineReducers
// ─────────────────────────────────────────────────────────────────────────────

import { combineReducers } from '@reduxjs/toolkit';
import consumerReducer from './consumerReducer';
import providerReducer from './providerReducer';
import opsReducer from './opsReducer';

const rootReducer = combineReducers({
  consumer: consumerReducer,
  provider: providerReducer,
  ops: opsReducer,
});

export default rootReducer;
