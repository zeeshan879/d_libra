const initialState = {
  data: {},
};

export const parentChildCategory = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_PARENT_CHILD_CATEGORY":
      return {
        ...state,
        data: payload,
      };
    default:
      return state;
  }
};
