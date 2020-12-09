import { spawn } from 'redux-saga/effects';
import { watchForFetch, watchForLiveUpdates } from '../Features/Metrics/saga';

export default function* root() {
  yield spawn(watchForFetch);
  yield spawn(watchForLiveUpdates);
}
