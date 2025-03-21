import type { ReactNode } from 'react';
import { HeaderbarLayout } from './components/headerbar.layout.components';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <>
      <HeaderbarLayout />
      <div className="mx-auto w-[80%] text-white">{children}</div>
    </>
  );
}
