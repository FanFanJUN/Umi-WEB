import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../commons/BaseInfo'
import Modifyinfo from '../commons/Modifyinfo'
import Modifyinfluence from '../commons/Modifyinfluence'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent ,isEmpty} from '../../../../utils';

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

  useEffect(() => {

    }, []);
  // 保存
  async function handleSave() {
    let baseinfo,modifyVal,modifyanalysisVal;
    const { validateFieldsAndScroll } = BaseinfoRef.current.form;
    const {getmodifyform} = ModifyinfoRef.current;
    const {getmodifyanalyform} = ModifyinfluenceRef.current;
    validateFieldsAndScroll(async (err, val) => {
      if (!err) {
        baseinfo = val;
        console.log(baseinfo)
        modifyVal = getmodifyform()
        if (!modifyVal) {
          message.error('变更信息不能为空！');
          return false;
        }
        modifyanalysisVal = getmodifyanalyform()
        if (!modifyanalysisVal) {
          message.error('变更影响不能为空！');
          return false;
        }
      }else {
        message.error('基本信息不能为空！');
        return false;
      }
    })
   
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
            新增PCN变更信息
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
                //getBaseInfo={getBaseInfo}
                wrappedComponentRef={BaseinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更信息</div>
            <div >
            <Modifyinfo
                wrappedComponentRef={ModifyinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更影响分析</div>
            <div >
            <Modifyinfluence
                wrappedComponentRef={ModifyinfluenceRef}
            />
            </div>
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;