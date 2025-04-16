import { useEffect, useState } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Hook personalizado para usar observables do RxJS em componentes React
 *
 * @param observable$ - Um Observable ou BehaviorSubject do RxJS
 * @param initialValue - Valor inicial opcional (usado se o observable não for um BehaviorSubject)
 * @returns O valor atual do observable
 */
export function useObservable<T>(
  observable$: Observable<T> | BehaviorSubject<T>,
  initialValue?: T,
): T {
  const getInitialValue = () => {
    if ('getValue' in observable$) {
      return (observable$ as BehaviorSubject<T>).getValue();
    }
    return initialValue as T;
  };

  const [value, setValue] = useState<T>(getInitialValue());

  useEffect(() => {
    const subscription = observable$.subscribe((newValue) => {
      setValue(newValue);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [observable$]);

  return value;
}
