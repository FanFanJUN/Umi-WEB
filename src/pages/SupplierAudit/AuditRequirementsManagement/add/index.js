import React, { useEffect, useState } from 'react';
import { Affix, Button, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../Supplier/Editor/index.less';
import { closeCurrent, getMobile, getUserId, getUserName } from '../../../../utils';
import BaseInfo from './BaseInfo';
import { router } from 'dva';
import IntendedAuditInformation from './IntendedAuditInformation';

const Index = () => {

  const { query } = router.useLocation();

  const [data, setData] = useState({
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

  const handleSave = (type) => {
    console.log(type)
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
          userInfo={data.userInfo}
          type={'add'}
          isView={false}
        />
        <IntendedAuditInformation
          type={'add'}
          isView={false}
        />
      </Spin>
    </div>
  )

}

export default Index
