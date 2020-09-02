import { useRef, useState } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import { closeCurrent } from '../../../../utils';
import classnames from 'classnames';
import styles from './index.less';
import BaseInfo from '../components/edit/baseInfo';
import SubjectMatterForm from '../components/edit/SubjectMatterForm';
import SuppliersTable from '../components/edit/suppliersTable';
export default function () {
    const [loading, toggleLoading] = useState(false);
    const formRef = useRef(null);
    const handleBack = () => {
        closeCurrent()
    }
    return (
        <div>
            <Spin spinning={loading}>
                <Affix>
                    <div className={classnames(styles.fbc, styles.affixHeader)}>
                        <span className={styles.headTitle}>环保资料物料-明细</span>
                        <div>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                        </div>
                    </div>
                </Affix>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>基本信息</div>
                        <div className={styles.content}>
                            <BaseInfo wrappedComponentRef={formRef} />
                        </div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>标的物</div>
                        <div className={styles.content}>
                            <SubjectMatterForm />
                        </div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>分配供应商明细</div>
                        <div className={styles.content}>
                            <SuppliersTable />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    )
}