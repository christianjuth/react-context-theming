import * as React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div 
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#000',
        width: 300,
        height: '100vh',
        padding: '30px'
      }}
    >

      <Link to="/" style={{color: '#fff', textDecoration: 'none'}}>Function Components</Link>

    </div>
  );
}

export default Sidebar;