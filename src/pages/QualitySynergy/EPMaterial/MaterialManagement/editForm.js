import { useRef, useState } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import { closeCurrent } from '../../../../utils';
import classnames from 'classnames';
import styles from './index.less';
import BaseInfo from '../components/edit/baseInfo';
import SubjectMatterTable from '../components/edit/SubjectMatterTable';
import { router } from 'dva';
export default function () {
    const [loading, toggleLoading] = useState(false);
    const [buCode, setBuCode] = useState('')
    const formRef = useRef(null);
    const { query } = router.useLocation();
    console.log('url路径', query);
    const handleSave = async () => {
        const { getAllParams } = formRef.current;

    }
    const handleBack = () => {
        closeCurrent()
    }
    return (
        <div>
            <Spin spinning={loading}>
                <Affix>
                    <div className={classnames(styles.fbc, styles.affixHeader)}>
                        <span className={styles.headTitle}>环保资料物料-新增</span>
                        <div>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            <Button className={styles.btn} type='primary' onClick={handleSave}>保存</Button>
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
                            buCode={buCode} />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    )
}