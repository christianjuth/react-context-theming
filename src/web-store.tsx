import * as React from 'react';

type StyleReducerState = {
  styles: any
}

const types = {
  REGISTER_STYLE: 'REGISTER_STYLE'
}

const initialState: StyleReducerState = {
  styles: {}
}

const reducer = (state: StyleReducerState, action: any) => {
  switch (action.type) {
    case types.REGISTER_STYLE: 
      // register styles if it doesn't already exsist
      const styles = { 
        [action.payload.key]: action.payload.css,
        ...state.styles 
      };
      // update style without affecting priority
      styles[action.payload.key] = action.payload.css;
      return {
        ...state,
        styles
      }
    default:
      return state;
  }
}

const StoreContext = React.createContext<{
  state: StyleReducerState,
  dispatch: React.Dispatch<any>,
  conponentIdRef?: React.MutableRefObject<number>,
  serverStyles?: React.MutableRefObject<{ [key: string]: any }>
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
  const conponentIdRef = React.useRef(0);
  const serverStyles = React.useRef({});
  return (
    <StoreContext.Provider value={{ state, dispatch, conponentIdRef, serverStyles }}>
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
  })

}

export function useId() {
  const ref = React.useRef<number | null>(null);
  const { conponentIdRef } = React.useContext(StoreContext);
  
  if (ref.current === null && conponentIdRef) {
    ref.current = conponentIdRef.current;
    conponentIdRef.current++;
  }

  return ref.current + '';
}