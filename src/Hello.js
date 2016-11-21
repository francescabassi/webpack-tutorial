import React, { Component } from 'react';
import styles from './hello.module.css';

class Hello extends Component {
  render() {
    return (
      <div className={styles.root}>
        Hello!
      </div>
    );
  }
}

export default Hello;
