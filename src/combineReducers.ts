import { AnyAction, ReducersMapObject } from "redux";
import Immutable from "immutable";
import {
  getUnexpectedInvocationParameterMessage,
  validateNextState
} from "./utilities";

export default (
  reducers: ReducersMapObject<any, AnyAction>,
  getDefaultState: () => Immutable.Map<any, any> = Immutable.Map
): Function => {
  const reducerKeys = Object.keys(reducers);

  let defaultState = Immutable.Map();
  const fn = getDefaultState as Function;
  if (typeof getDefaultState !== "undefined") {
    defaultState = fn();
  }

  // eslint-disable-next-line space-infix-ops
  return (
    inputState: Immutable.Map<any, any> = defaultState,
    action: AnyAction
  ): Immutable.Map<any, any> => {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== "production") {
      const warningMessage = getUnexpectedInvocationParameterMessage(
        inputState,
        reducers,
        action
      );

      if (warningMessage) {
        // eslint-disable-next-line no-console
        console.error(warningMessage);
      }
    }

    return inputState.withMutations(temporaryState => {
      reducerKeys.forEach(reducerName => {
        const reducer = reducers[reducerName];
        const currentDomainState = temporaryState.get(reducerName);
        const nextDomainState = reducer(currentDomainState, action);

        validateNextState(nextDomainState, reducerName, action);

        temporaryState.set(reducerName, nextDomainState);
      });
    });
  };
};
