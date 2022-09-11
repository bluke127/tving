import { useEffect, useState, useCallback } from 'react';
import { loadingState } from '../atoms';
import { useRecoilState } from 'recoil';
const UseAsync = (asyncFunction: any, immediate = false) => {
  const [loading, setLoading] = useRecoilState(loadingState);
  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setLoading(true);
    return asyncFunction()
      .then((response: any) => {
        setLoading(false);
        return response;
      })
      .catch((error: any) => {
        setLoading(false);
      });
  }, [asyncFunction]);
  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    console.log(immediate, 'imme');
    if (immediate) {
      execute();
    }
  }, [immediate]);
  return { execute };
};
export default UseAsync;
