let initialState = '';

if (localStorage.getItem('id')) {
  initialState = localStorage.getItem('id');
}
export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_ID':
      return action.payload;
    case 'USER_ID':
      return action.payload;
    case 'CLOSE_MODAL':
      return action.payload;
    default:
      return state;
  }
};
