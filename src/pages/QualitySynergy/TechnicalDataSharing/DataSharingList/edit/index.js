import React, { useState, useEffect, useRef } from 'react';
import { Affix, Button, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserAccount, getUserId, getUserName } from '../../../../../utils';
import BaseInfo from './BaseInfo';
import MaterialInfo from './MaterialInfo';
import TechnicalData from './TechnicalData';
import { AddDataSharingList } from '../../../commonProps';

export default () => {
  const { query } = router.useLocation();

  const baseInfoRef = useRef(null);
  const materialInfoRef = useRef(null);
  const technicalDataRef = useRef(null);

  const [buCode, setBuCode] = useState(undefined)

  const [data, setData] = useState({
    isView: false,
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
        setData((value) => ({...value, type: pageState, title: '技术资料分享需求-新增', isView: false}))
        break
      case 'detail':
        getUser()
        setData((value) => ({...value, type: pageState, isView: true, title: '技术资料分享需求-明雄'}))
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

  const handleSave = async () => {
    const baseInfoData = await baseInfoRef.current.getBaseInfoData((err, values) => {
      if (!err) {
        return values
      }
    })
    const materialInfoData = await materialInfoRef.current.getMaterialInfoData((err, values) => {
      if (!err) {
        return values
      }
    })
    const technicalData = technicalDataRef.current.dataSource
    const data = {...baseInfoData, ...materialInfoData, epTechnicalDataBoList: technicalData}
    console.log(data)
    AddDataSharingList(data).then(res => {
      console.log(res, 'res')
    })
    console.log('保存', baseInfoData, materialInfoData, technicalData)
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
          isView={data.isView}
          setBuCode={setBuCode}
          wrappedComponentRef={baseInfoRef}
          userInfo={data.userInfo}
          type={data.type}
        />
        <MaterialInfo
          buCode={buCode}
          isView={data.isView}
          wrappedComponentRef={materialInfoRef}
          type={data.type}
        />
        {
          data.type === 'add' && <TechnicalData
            isView={data.isView}
            wrappedComponentRef={technicalDataRef}
            type={data.type}
          />
        }
      </Spin>
    </div>
  )
}
