import Immutable from "immutable";
import getStateName from "./getStateName";
import { AnyAction } from "redux";

export default <S extends Immutable.Map<string, any>>(
  state: S | undefined | Object,
  reducers: Object,
  action: AnyAction
) => {
  const reducerNames = Object.keys(reducers);

  if (!reducerNames.length) {
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  }

  const stateName = getStateName(action);

  if (
    Immutable.isImmutable
      ? !Immutable.isImmutable(state)
      : !Immutable.isCollection(state)
  ) {
    return (
      "The " +
      stateName +
      ' is of unexpected type. Expected argument to be an instance of Immutable.Collection or Immutable.Record with the following properties: "' +
      reducerNames.join('", "') +
      '".'
    );
  }

  if (Immutable.isMap(state)) {
    let stateMap = state as Immutable.Map<string, unknown>;
    const unexpectedStatePropertyNames = stateMap.filter(
      (_, name) => !reducers.hasOwnProperty(name)
    );

    if (unexpectedStatePropertyNames.size > 0) {
      return (
        "Unexpected " +
        (unexpectedStatePropertyNames.size === 1 ? "property" : "properties") +
        ' "' +
        [unexpectedStatePropertyNames.keys()].join('", "') +
        '" found in ' +
        stateName +
        '. Expected to find one of the known reducer property names instead: "' +
        reducerNames.join('", "') +
        '". Unexpected properties will be ignored.'
      );
    }
  }

  return null;
};
