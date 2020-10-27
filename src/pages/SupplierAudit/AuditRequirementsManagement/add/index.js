import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../Supplier/Editor/index.less';
import { closeCurrent, getMobile, getUserId, getUserName } from '../../../../utils';
import BaseInfo from './BaseInfo';
import { router } from 'dva';
import IntendedAuditInformation from './IntendedAuditInformation';
import { GetAllAuditType } from '../../mainData/commomService';

const Index = () => {
  const baseInfoRef = useRef(null);

  const { query } = router.useLocation();

  const [applyCorporationCode, setApplyCorporationCode] = useState('')

  const [companyCode, setCompanyCode] = useState('')

  const [organizationCode, setOrganizationCode] = useState()

  const [data, setData] = useState({
    allAuditType: [],
    id: '',
    editDate: {},
    spinLoading: false,
    isView: false,
    loading: false,
    type: 'add',
    title: '',
    userInfo: {},
  })

  useEffect(() => {
    // 获取所有审核类型
    getAuditType()
    const { id, pageState } = query;
    switch (pageState) {
      case 'add':
        getUser();
        setData((value) => ({ ...value, type: pageState, isView: false, title: '审核需求管理-新增' }));
        break;
      case 'edit':
        getUser();
        setData((value) => ({ ...value, type: pageState, id, isView: false, title: '审核需求管理-编辑' }));
        break;
      case 'detail':
        setData((value) => ({ ...value, type: pageState, isView: true, title: `审核需求管理-明细`}));
        break;
    }
    console.log(pageState, 'pageState');
  }, []);

  const getAuditType = () => {
    GetAllAuditType().then(res => {
      if (res.success) {
        setData(v => ({...v, allAuditType: res.data}))
      } else {
        message.error('获取审核类型失败')
      }
    })
  }

  const getUser = () => {
    const userId = getUserId();
    const userName = getUserName();
    const userMobile = getMobile();
    setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
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
    console.log(baseInfoData)
  }

  return(
    <div>
      <Spin spinning={data.spinLoading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>{data.title}</span>
            {
              data.type !== 'detail' && <div>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                <Button className={styles.btn} onClick={() => handleSave('add')}>暂存</Button>
                <Button className={styles.btn} type='primary' onClick={() => handleSave('addSave')} >提交</Button>
              </div>
            }
          </div>
        </Affix>
        <BaseInfo
          setCompanyCode={setCompanyCode}
          setOrganizationCode={setOrganizationCode}
          wrappedComponentRef={baseInfoRef}
          userInfo={data.userInfo}
          type={data.type}
          setApplyCorporationCode={setApplyCorporationCode}
          isView={data.isView}
        />
        <IntendedAuditInformation
          companyCode={companyCode}
          organizationCode={organizationCode}
          allAuditType={data.allAuditType}
          applyCorporationCode={applyCorporationCode}
          type={data.type}
          isView={data.isView}
        />
      </Spin>
    </div>
  )

}

export default Index
