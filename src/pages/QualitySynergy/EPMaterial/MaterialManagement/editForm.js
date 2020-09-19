import { useRef, useState } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import { closeCurrent } from '../../../../utils';
import classnames from 'classnames';
import styles from './index.less';
import BaseInfo from '../components/edit/baseInfo';
import SubjectMatterTable from '../components/edit/SubjectMatterTable';
import { submitAndSave, addEpDemandList } from '../../../../services/qualitySynergy'
export default function () {
    const [loading, toggleLoading] = useState(false);
    const [buCode, setBuCode] = useState('')
    const formRef = useRef(null);
    const tableRef = useRef(null);
    const handleBack = () => {
        closeCurrent()
    }
    const handleSave = async (nowPublish) => {
        const { validateFieldsAndScroll } = formRef.current;
        validateFieldsAndScroll(async (err, values) => {
            console.log(values)
            if (!err) {
                toggleLoading(true);
                let res = {};
                let dataSource = tableRef.current.getTableList();
                dataSource = dataSource.map(item => {
                    return {
                        ...item,
                        ...values,
                    }
                })
                if(nowPublish) {
                    // 保存并提交
                    res = await submitAndSave(dataSource);
                } else {
                    // 仅保存
                    res = await addEpDemandList(dataSource);
                }
                console.log(res);
                toggleLoading(false);
               if(res.success && res.statusCode === 200) {
                   message.success(nowPublish? '保存并提交成功' : '保存成功');
                   setTimeout(()=>{
                        handleBack();
                   }, 3000)
               } else {
                   message.error(res.message);
               }
            }
        })
    }
    return (
        <div>
            <Spin spinning={loading}>
                <Affix>
                    <div className={classnames(styles.fbc, styles.affixHeader)}>
                        <span className={styles.headTitle}>环保资料物料-新增</span>
                        <div>
                            <Button className={styles.btn} key="back" onClick={handleBack}>返回</Button>
                            <Button className={styles.btn} key="save" onClick={()=>{handleSave()}}>保存</Button>
                            <Button className={styles.btn} key="publish" type='primary' onClick={()=>{handleSave(true)}}>保存并提交</Button>
                        </div>
                    </div>
                </Affix>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>基本信息</div>
                        <div className={styles.content}>
                            <BaseInfo wrappedComponentRef={formRef} setBuCode={setBuCode} />
                        </div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>标的物</div>
                        <div className={styles.content}>
                            <SubjectMatterTable
                                wrappedComponentRef={tableRef}
                                buCode={buCode} />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    )
}