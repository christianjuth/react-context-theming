import * as React from 'react';

function Button({ 
  children,
  color = '#000',
  onClick,
  style
}: {
  children: React.ReactNode,
  color?: string,
  onClick?: () => any,
  style?: React.CSSProperties
}) {

  const computedStyle = Object.assign({}, {
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: color,
    color,
    cursor: 'pointer',
    padding: '10px 15px',
    textAlign: 'center'
  }, style);

  return (
    <div style={computedStyle} onClick={onClick}>
      {children}
    </div>
  );
}

export default Button;