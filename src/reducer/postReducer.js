let initialState = false;
if (localStorage.getItem('post')) {
  initialState = localStorage.getItem('post');
}
export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_POST_MODAL':
      return action.payload;
    case 'HIDE_POST_MODAL':
      return action.payload;
    default:
      return state;
  }
};
