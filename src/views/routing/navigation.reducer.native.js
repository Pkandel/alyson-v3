import { AppStack } from './Routing';

const initialState = AppStack.router.getStateForAction(
  AppStack.router.getActionForPathAndParams( 'generic', { layout: 'home' })
);

const reducer = ( state = initialState, action ) => {
  if ( action.type === 'USER_LOGOUT' ) {
    return { ...initialState };
  }

  const nextState = AppStack.router.getStateForAction( action, state );

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

export default reducer;