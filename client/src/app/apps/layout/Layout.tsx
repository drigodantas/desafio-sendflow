import type { ReactNode } from 'react';
import { HeaderBarLayout } from './components/HeaderBarLayout';

interface Props {
  children: ReactNode;
}

export function Layout(props: Props) {
  const { children } = props;
  return (
    <>
      <HeaderBarLayout />
      <div className="mx-auto w-[80%] text-white">{children}</div>
    </>
  );
}
