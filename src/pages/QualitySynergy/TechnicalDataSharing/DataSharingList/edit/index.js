import React, { useState, useEffect, useRef } from 'react';
import { Affix, Button, message, Modal, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../../Supplier/Editor/index.less';
import { router } from 'dva';
import { closeCurrent, getMobile, getUserAccount, getUserId, getUserName, openNewTab } from '../../../../../utils';
import BaseInfo from './BaseInfo';
import MaterialInfo from './MaterialInfo';
import TechnicalData from './TechnicalData';
import {
  AddDataSharingList,
  DataSharingFindOne,
  generateLineNumber,
  getRandom, MaterialSourceArr, SubmitDataSharingList,
  UpdateDataSharingList,
} from '../../../commonProps';
import SupplierData from './SupplierData';

export default () => {
  const { query } = router.useLocation();

  const baseInfoRef = useRef(null);
  const materialInfoRef = useRef(null);
  const technicalDataRef = useRef(null);

  const [buCode, setBuCode] = useState(undefined);

  const [deleteArr, setDeleteArr] = useState([]);

  const [data, setData] = useState({
    id: '',
    editDate: {},
    spinLoading: false,
    isView: false,
    loading: false,
    type: 'add',
    title: '',
    userInfo: {},
  });

  useEffect(() => {
    const { id, pageState } = query;
    switch (pageState) {
      case 'add':
        getUser();
        setData((value) => ({ ...value, type: pageState, isView: false, title: '技术资料分享需求-新增' }));
        break;
      case 'edit':
        getUser();
        findOne(id);
        setData((value) => ({ ...value, type: pageState, id, isView: false, title: '技术资料分享需求-编辑' }));
        break;
      case 'detail':
        findOne(id);
        setData((value) => ({ ...value, type: pageState, isView: true, title: `技术资料分享需求-明细`}));
        break;
    }
    console.log(pageState, 'pageState');
  }, []);

  const getUser = () => {
    const userId = getUserId();
    const userName = getUserName();
    const userMobile = getMobile();
    setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
  };

  useEffect(() => {
    if (data.type === 'detail') {
      setData(v => ({...v, title: `技术资料分享需求-明细 ${data?.editDate?.shareDemanNumber}`}))
    }
  }, [data.editDate?.shareDemanNumber])

  const findOne = (id) => {
    setData(v => ({...v, spinLoading: true}))
    DataSharingFindOne({ id }).then(res => {
      console.log(res);
      if (res.success) {
        res.data.epTechnicalDataVos = res.data.epTechnicalDataVos.map(item => ({
          ...item,
          lineNumber: getRandom(10).toString(),
        }));
        console.log(res.data);
        res.data.technicalDataAndSupplierVos = res.data.technicalDataAndSupplierVos.map((item, index) => ({
          ...item,
          technicalLineNumber: generateLineNumber(index + 1),
        }));
        setData(v => ({ ...v, editDate: res.data, spinLoading: false }));
      } else {
        setData(v => ({...v, spinLoading: false}))
        message.error(res.message);
      }
    });
  };

  const handleBack = () => {
    setData(v => ({...v, loading: false}))
    // openNewTab(`qualitySynergy/DataSharingList`, '技术资料分享需求列表', true);
    closeCurrent();
  };

  const handleSave = async (type) => {
    const baseInfoData = await baseInfoRef.current.getBaseInfoData((err, values) => {
      if (!err) {
        return values;
      }
    });
    const materialInfoData = await materialInfoRef.current.getMaterialInfoData((err, values) => {
      if (!err) {
        return values;
      }
    });
    let technicalData = technicalDataRef.current.dataSource;
    if (technicalData.length === 0) {
      return message.error('至少添加一行技术资料')
    }
    // 为技术资料生成行号
    technicalData.map((item, index) => {
      item.technicalLineNumber = generateLineNumber(index + 1)
    })
    let allData = { ...baseInfoData, ...materialInfoData, epTechnicalDataBoList: technicalData };
    Modal.confirm({
      title: type === 'add' ? '保存' : '保存并提交',
      content: type === 'add' ? '请确认保存数据' : '请确认保存并提交数据',
      okText: '确定',
      loading: data.loading,
      cancelText: '取消',
      onOk: async () => {
        setData(v => ({...v, loading: true}))
        if (!data.id) {
          const saveResult = await AddDataSharingList(allData);
          if (saveResult.success) {
            // 如果保存并提交
            if (type === 'addSave') {
              const submitResult = await SubmitDataSharingList({ ids: saveResult.data });
              if (submitResult.success) {
                message.success(submitResult.message);
                handleBack()
              } else {
                setData(v => ({...v, loading: false}))
                message.error(submitResult.message);
              }
            } else {
              message.success(saveResult.message);
              handleBack()
            }
          } else {
            setData(v => ({...v, loading: false}))
            message.error(saveResult.message);
          }
        } else {
          allData.id = data.id;
          allData.state = '草稿';
          allData.allotSupplierState = '未分配';
          allData.epTechnicalDataBoList.map(item => {
            if (item.id) {
              item.technicalDataFileIdList = item.technicalDataFileIdList.map(items => {
                console.log(item, items, 'id')
                if (items.id) {
                  return items.id;
                } else {
                  return items
                }
              });
            }
          });
          allData.epTechnicalDataBoList = [...allData.epTechnicalDataBoList, ...deleteArr];
          const updateRes = await UpdateDataSharingList(allData)
          if (updateRes.success) {
            if (type === 'addSave') {
              const updateSubmitResult = await SubmitDataSharingList({ ids: allData.id });
              if (updateSubmitResult.success) {
                message.success(updateSubmitResult.message)
                handleBack()
              } else {
                setData(v => ({...v, loading: false}))
                message.error(updateSubmitResult.message)
              }
            } else {
              message.success(updateRes.message);
              handleBack()
            }
          } else {
            setData(v => ({...v, loading: false}))
            message.error(updateRes.message)
          }
          console.log(allData);
        }
      }
    })
  };

  return (
    <div>
      <Spin spinning={data.spinLoading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>{data.title}</span>
            {
              data.type !== 'detail' && <div>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                <Button className={styles.btn} onClick={() => handleSave('add')}>保存</Button>
                <Button className={styles.btn} type='primary' onClick={() => handleSave('addSave')} >保存并提交</Button>
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
        <TechnicalData
          data={data.editDate?.epTechnicalDataVos}
          userInfo={data.userInfo}
          isView={data.isView}
          setDeleteArr={setDeleteArr}
          deleteArr={deleteArr}
          wrappedComponentRef={technicalDataRef}
          type={data.type}
        />
        {
          data.type === 'detail' && data?.editDate?.technicalDataAndSupplierVos?.length > 0 ? <SupplierData
            data={data.editDate?.technicalDataAndSupplierVos}
          /> : ''
        }
      </Spin>
    </div>
  );
}
