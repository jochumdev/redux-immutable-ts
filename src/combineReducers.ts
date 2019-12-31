import { AnyAction, ReducersMapObject } from "redux";
import Immutable from "immutable";
import { getUnexpectedInvocationParameterMessage } from "./utilities";

export default <S extends Immutable.Map<string, any>>(
  reducers: ReducersMapObject<any, AnyAction>,
  getDefaultState: () => S
): ((inputState: S | undefined, action: AnyAction) => S) => {
  const reducerKeys = Object.keys(reducers);

  // eslint-disable-next-line space-infix-ops
  return (inputState: S | undefined, action: AnyAction): S => {
    if (typeof inputState === "undefined") {
      inputState = getDefaultState();
    }

    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== "production") {
      const warningMessage = getUnexpectedInvocationParameterMessage<S>(
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

        if (nextDomainState === undefined) {
          throw new Error(
            'Reducer "' +
              reducerName +
              '" returned undefined when handling "' +
              action.type +
              '" action. To ignore an action, you must explicitly return the previous state.'
          );
        }

        temporaryState.set(reducerName, nextDomainState);
      });
    });
  };
};
