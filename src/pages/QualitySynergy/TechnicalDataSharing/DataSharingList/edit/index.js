import React, { useState, useEffect  } from 'react';
import { Affix, Button, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent } from '../../../../../utils';
import BaseInfo from './BaseInfo';
import MaterialInfo from './MaterialInfo';
import TechnicalData from './TechnicalData';

export default () => {
  const { query } = router.useLocation();

  const [data, setData] = useState({
    loading: false,
    title: ''
  })

  useEffect(() => {
    const { id, pageState } = query;
    switch (pageState) {
      case 'add':
        setData((value) => ({...value, title: '技术资料分享需求-新增'}))
    }
    console.log(pageState, 'pageState')
  }, [])

  const handleBack = () => {
    closeCurrent()
  }

  const handleSave = () => {
    console.log('保存')
  }

  return (
    <div>
      <Spin spinning={data.loading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>{data.title}</span>
            <div>
              <Button className={styles.btn} onClick={handleBack}>返回</Button>
              <Button className={styles.btn} onClick={handleSave}>保存</Button>
              <Button className={styles.btn} type='primary' onClick={handleSave}>保存并提交</Button>
            </div>
          </div>
        </Affix>
        <BaseInfo
          type={'add'}
        />
        <MaterialInfo
          type={'add'}
        />
        <TechnicalData

        />
      </Spin>
    </div>
  )
}
