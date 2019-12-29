import { AnyAction } from "redux";

export default (action: AnyAction): string => {
  return action && action.type === "@@redux/INIT"
    ? "initialState argument passed to createStore"
    : "previous state received by the reducer";
};
