import { useRef, useState, useEffect } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import { closeCurrent } from '../../../../utils';
import { router } from 'dva';
import classnames from 'classnames';
import styles from './index.less';
import BaseInfo from '../components/edit/baseInfo';
import SubjectMatterForm from '../components/edit/SubjectMatterForm';
import SupplierInfo from '../components/edit/supplierInfo';
import MCDTable from './MCDTable';
import { supplerFindVoById, epDemandUpdate, getNotes } from '../../../../services/qualitySynergy'
export default function () {
  const [loading, toggleLoading] = useState(false);
  const [originData, setOriginData] = useState({})
  const supplierRef = useRef(null);
  const mcdRef = useRef(null);
  const [notesList, setNotesList] = useState([]);
  const [statement, setStatement] = useState([]);
  const { query } = router.useLocation();
  const handleBack = () => {
    closeCurrent();
  }
  useEffect(() => {
    getNotes().then(res => {
      if (res.data && res.data.rows) {
        let statements = '';
        res.data.rows.map(item => {
          if (item.modelType === 'SM') {
            statements += item.chContent
          }
        });
        setStatement(statements);
        setNotesList(res.data.rows);
      } else {
        message.error('获取填写说明失败!');
      }
    })
  }, [])
  const handleSave = (publish) => {
    let saveData = { ...originData }
    supplierRef.current.validateFieldsAndScroll(async (error, values) => {
      if (!error) {
        const macData = mcdRef.current.getSplitDataList();
        if (!macData.tag) return;
        toggleLoading(true);
        values.uploadAttachmentIds = values.reachEnvironmentList ? values.reachEnvironmentList.map(item => item.id ? item.id : item) : [];
        values.reachEnvironmentId = values.uploadAttachmentIds.join();
        saveData = { ...saveData, ...values, commit: !!publish, ...macData }
        saveData.epDataFillSplitPartsBoList = macData.epDataFillSplitPartsVoList;
        delete saveData.epDataFillSplitPartsVoList;
        delete saveData.tag;
        const res = await epDemandUpdate(saveData);
        toggleLoading(false);
        if (res.statusCode === 200) {
          message.success('操作成功');
          setTimeout(() => {
            handleBack();
          }, 1000)
        } else {
          message.error(res.message);
        }
      }
    })
  }
  useEffect(() => {
    (async function () {
      toggleLoading(true);
      const res = await supplerFindVoById({ id: query.id });
      if (res.statusCode === 200) {
        setOriginData(res.data)
      } else {
        message.error(res.message);
      }
      toggleLoading(false);
    })();
  }, [])
  return (
    <div>
      <Spin spinning={loading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span className={styles.headTitle}>{query.pageStatus === 'add' ? `环保资料填报-${originData.fillNumber}` : `环保资料填报明细-${originData.fillNumber}`}</span>
            {
              query.pageStatus === 'detail' ? <div>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
              </div> : <div>
                  <Button className={styles.btn} onClick={() => { handleSave(false) }}>保存</Button>
                  <Button className={styles.btn} type="primary" onClick={() => { handleSave(true) }}>保存并提交</Button>
                </div>
            }
          </div>
        </Affix>
        <div className={styles.wrapper}>
          <div className={styles.bgw}>
            <div className={styles.title}>基本信息</div>
            <div className={styles.content}>
              <BaseInfo isView={true} originData={originData} isSupplier={true} />
            </div>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.bgw}>
            <div className={styles.title}>标的物</div>
            <div className={styles.content}>
              <SubjectMatterForm originData={originData} />
            </div>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.bgw}>
            <div className={styles.title}>供应商信息</div>
            <div className={styles.content}>
              <SupplierInfo wrappedComponentRef={supplierRef} originData={originData} isView={query.pageStatus === 'detail'} statement={statement} />
            </div>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.bgw}>
            <div className={styles.title}>填写说明</div>
            <div className={styles.content} style={{ paddingBottom: '10px' }}>
              <ul style={{ border: '1px solid #d9d9d9', padding: '0', borderBottom: 'none' }}>
                {
                  notesList.map((item, index) => {
                    if (item.modelType === 'SM') return '';
                    return <li style={{ borderBottom: '1px solid #d9d9d9', padding: '5px 15px' }} key={index}>
                      <div>{index + 1 + '. ' + item.chContent}</div>
                      <div style={{ paddingLeft: '10px' }}>{item.ehContent}</div>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.bgw}>
            <div className={styles.title}>MCD表</div>
            <div className={styles.content}>
              <MCDTable wrappedComponentRef={mcdRef} originData={originData} isView={query.pageStatus === 'detail'} />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}