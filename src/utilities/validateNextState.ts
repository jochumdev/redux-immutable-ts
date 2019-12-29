import { AnyAction } from "redux";

export default (
  nextState: any,
  reducerName: string,
  action: AnyAction
): void => {
  // eslint-disable-next-line no-undefined
  if (nextState === undefined) {
    throw new Error(
      'Reducer "' +
        reducerName +
        '" returned undefined when handling "' +
        action.type +
        '" action. To ignore an action, you must explicitly return the previous state.'
    );
  }
};
