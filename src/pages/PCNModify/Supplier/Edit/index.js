import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../commons/BaseInfo'
import Modifyinfo from '../commons/Modifyinfo'
import Modifyinfluence from '../commons/Modifyinfluence'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent ,isEmpty} from '../../../../utils';
import {findPCNSupplierId} from '../../../../services/pcnModifyService'
function CreateStrategy() {
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const ModifyinfluenceRef = useRef(null);
  const [baseinfo, setbaseinfo] = useState([]);
  const [accountinfo, setaccountinfo] = useState([]);
  const [businesshide, setbusinesshide] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [wholeData, setwholeData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [againdata, setAgaindata] = useState({});
  const [loading, triggerLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [configure, setConfigure] = useState([]);
  const [supplierName, setsupplierName] = useState();
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;

    // 获取配置列表项
  useEffect(() => {
    infoPCNdetails()
  }, []);
  // 详情
  async function infoPCNdetails() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await findPCNSupplierId({pcnTitleId:id});
    if (success) {
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg) 
  }
  // 保存
  async function handleSave() {
    
  }
  // 返回
  function handleBack() {
    closeCurrent()
  }
  function handleCancel() {
    setvisible(false)
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            编辑PCN变更信息
            </span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>

      </Affix>

      <div className={styles.wrapper}>
        <div className={styles.bgw}>
            <div className={styles.title}>基本信息</div>
            <div >
            <BaseInfo
                baseinfo={baseinfo}
                initialValues={editData}
                editformData={editData}
                wholeData={wholeData}
                wrappedComponentRef={BaseinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更信息</div>
            <div >
            <Modifyinfo
                baseinfo={baseinfo}
                initialValues={editData}
                editformData={editData}
                wholeData={wholeData}
                wrappedComponentRef={ModifyinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更影响分析</div>
            <div >
            <Modifyinfluence
                baseinfo={baseinfo}
                initialValues={editData}
                editformData={editData}
                wholeData={wholeData}
                wrappedComponentRef={ModifyinfluenceRef}
            />
            </div>
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;