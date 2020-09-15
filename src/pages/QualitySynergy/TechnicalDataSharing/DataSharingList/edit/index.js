import React, { useState, useEffect, useRef } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserAccount, getUserId, getUserName } from '../../../../../utils';
import BaseInfo from './BaseInfo';
import MaterialInfo from './MaterialInfo';
import TechnicalData from './TechnicalData';
import { AddDataSharingList, DataSharingFindOne, getRandom, UpdateDataSharingList } from '../../../commonProps';
import SupplierData from './SupplierData';

export default () => {
  const { query } = router.useLocation();

  const baseInfoRef = useRef(null);
  const materialInfoRef = useRef(null);
  const technicalDataRef = useRef(null);

  const [buCode, setBuCode] = useState(undefined)

  const [deleteArr, setDeleteArr] = useState([])

  const [data, setData] = useState({
    id: '',
    editDate: {},
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
        setData((value) => ({...value, type: pageState, isView: false, title: '技术资料分享需求-新增'}))
        break
      case 'edit':
        findOne(id)
        setData((value) => ({...value, type: pageState, id, isView: false, title: '技术资料分享需求-编辑'}))
        break
      case 'detail':
        findOne(id)
        setData((value) => ({...value, type: pageState, isView: true, title: '技术资料分享需求-明细'}))
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

  const findOne = (id) => {
    DataSharingFindOne({id}).then(res => {
      console.log(res)
      if (res.success) {
        res.data.epTechnicalDataVos = res.data.epTechnicalDataVos.map(item => ({...item, lineNumber: getRandom(10).toString()}))
        console.log(res.data)
        setData(v => ({...v, editDate: res.data}))
      } else {
        message.error(res.message)
      }
    })
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
    let allData = {...baseInfoData, ...materialInfoData, epTechnicalDataBoList: technicalData}
    if (data.type === 'add') {
      AddDataSharingList(allData).then(res => {
        if (res.success) {
          message.success(res.message)
          closeCurrent()
        } else {
          message.error(res.message)
        }
      })
    } else {
      allData.id = data.id
      allData.state = data.state
      allData.allotSupplierState = data.allotSupplierState
      allData.epTechnicalDataBoList.map(item => {
        if (item.id) {
          item.technicalDataFileIdList = item.technicalDataFileIdList.map(items => {
            if (items.id) {
              return item.id
            }
          })
        }
      })
      allData.epTechnicalDataBoList = [...allData.epTechnicalDataBoList, ...deleteArr]
      UpdateDataSharingList(allData).then(res => {
        if (res.success) {
          message.success(res.message)
          closeCurrent()
        } else {
          message.error(res.message)
        }
      })
      console.log(allData)
    }
  }

  return (
    <div>
      <Spin spinning={data.loading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>{data.title}</span>
            {
              data.type !== 'detail' && <div>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                <Button className={styles.btn} onClick={handleSave}>保存</Button>
                <Button className={styles.btn} type='primary' onClick={handleSave}>保存并提交</Button>
              </div>
            }
          </div>
        </Affix>
        <BaseInfo
          data={data.editDate}
          isView={data.isView}
          setBuCode={setBuCode}
          wrappedComponentRef={baseInfoRef}
          userInfo={data.userInfo}
          type={data.type}
        />
        <MaterialInfo
          data={data.editDate}
          buCode={buCode}
          isView={data.isView}
          wrappedComponentRef={materialInfoRef}
          type={data.type}
        />
        {
          data.type !== 'detail' && <TechnicalData
            data={data.editDate?.epTechnicalDataVos}
            isView={data.isView}
            setDeleteArr={setDeleteArr}
            wrappedComponentRef={technicalDataRef}
            type={data.type}
          />
        }
        {
          data.type === 'detail' && <SupplierData
            data={data.editDate?.epTechnicalSupplierVos}
          />
        }
      </Spin>
    </div>
  )
}
