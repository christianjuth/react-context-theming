import * as React from 'react';
import { Link } from 'react-router-dom';
import { NamedStyles } from 'react-context-theming/web';

function Sidebar() {
  return (
    <div style={styles.container}>
      <Link to="/" style={styles.link}>Function Components</Link>
      <Link to="/class-component" style={styles.link}>Class Components</Link>
      <Link to="/custom-theme" style={styles.link}>Custom Theme</Link>
      <Link to="/typescript" style={styles.link}>TypeScript</Link>
      <Link to="/class-names" style={styles.link}>Class Names</Link>
    </div>
  );
}

const styles: any = {
  container: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#000',
    width: 275,
    height: '100vh',
    padding: '30px',
    flexDirection: 'column',
    display: 'flex'
  },
  link: {
    color: '#fff', 
    textDecoration: 'none',
    padding: '10px 0'
  }
} as NamedStyles<any>;

export default Sidebar;