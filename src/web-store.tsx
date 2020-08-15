import * as React from 'react';

type StyleReducerState = {
  styles: any
}

const types = {
  REGISTER_STYLE: 'REGISTER_STYLE',
  DEREGISTER_STYLE: 'DEREGISTER_STYLE'
}

const initialState: StyleReducerState = {
  styles: {}
}

const reducer = (state: StyleReducerState, action: any) => {
  switch (action.type) {
    case types.REGISTER_STYLE: 
      return {
        ...state,
        styles: {
          ...state.styles,
          [action.payload.key]: action.payload.css
        }
      }
    // case types.DEREGISTER_STYLE: 
    //   // register styles if it doesn't already exsist
    //   const stylesClone = {
    //     ...state.styles 
    //   };
    //   delete stylesClone[action.payload.key]
    //   return {
    //     ...state,
    //     styles: stylesClone
    //   }
    default:
      return state;
  }
}

const StoreContext = React.createContext<{
  state: StyleReducerState,
  dispatch: React.Dispatch<any>,
}>({
  state: initialState,
  dispatch: () => {}
});

export function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [ state, dispatch ] = React.useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return React.useContext(StoreContext);
}

export function useDispatch() {
  return React.useContext(StoreContext).dispatch;
}

export const storeActions = {

  registerStyle: ({ 
    key, 
    css
  }: { 
    key: string, 
    css: string 
  }) => ({
    type: types.REGISTER_STYLE,
    payload: {
      key,
      css
    }
  }),

  deregisterStyle: ({
    key
  }: {
    key: string
  }) => ({
    type: types.DEREGISTER_STYLE,
    payload: {
      key
    }
  })

}