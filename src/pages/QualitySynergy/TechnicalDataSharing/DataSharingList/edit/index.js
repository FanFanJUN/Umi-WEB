import React, { useState, useEffect  } from 'react';
import { Affix, Button, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserAccount, getUserId, getUserName } from '../../../../../utils';
import BaseInfo from './BaseInfo';
import MaterialInfo from './MaterialInfo';
import TechnicalData from './TechnicalData';

export default () => {
  const { query } = router.useLocation();

  const [data, setData] = useState({
    loading: false,
    type: 'add',
    title: '',
    userInfo: {}
  })

  useEffect( () => {
    const { id, pageState } = query;
    switch (pageState) {
      case 'add':
        getUser()
        setData((value) => ({...value, type: pageState, title: '技术资料分享需求-新增'}))
        break
    }
    console.log(pageState, 'pageState')
  }, [])

  const getUser = () => {
    const userId = getUserId()
    const userName = getUserName()
    const userMobile = getMobile()
    setData((v) => ({...v, userInfo: {userName, userId, userMobile}}))
  }

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
          userInfo={data.userInfo}
          type={data.type}
        />
        <MaterialInfo
          type={data.type}
        />
        {
          data.type === 'add' && <TechnicalData
            type={data.type}
          />
        }
      </Spin>
    </div>
  )
}
