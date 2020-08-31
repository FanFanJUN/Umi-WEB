import { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { Header } from '../../components'
import { ExtTable } from 'suid';

export default () => {
  return (
    <div>
      <Header />
      <ExtTable />
    </div>
  )
}