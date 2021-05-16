import {Action} from '@ngrx/store';


export const START_LOADING = '[LoadingState] Start Loading';
export const STOP_LOADING = '[LoadingState] Stop Loading';

export class StartLoading implements Action {
  readonly type = START_LOADING;
}

export class StopLoading implements Action {
  readonly type = STOP_LOADING;
}

export type LoadingStateActions = StartLoading | StopLoading;
