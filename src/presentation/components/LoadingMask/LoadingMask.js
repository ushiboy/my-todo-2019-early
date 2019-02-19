/* @flow */
import * as React from 'react';
import LoadingOverlay from 'react-loading-overlay';

type Props = {
  show: boolean,
  children?: React.Node
};

export const LoadingMask = (props: Props) => {
  const { show, children } = props;
  return (
    <LoadingOverlay
      active={show}
      spinner
      background={'rgba(0, 0, 0, 0.3)'}
      color={'#333'}
      text="読み込み中"
    >
      {children}
    </LoadingOverlay>
  );
};
