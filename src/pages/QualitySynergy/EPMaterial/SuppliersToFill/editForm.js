import { useRef, useState } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import { closeCurrent } from '../../../../utils';
import { router } from 'dva';
import classnames from 'classnames';
import styles from './index.less';
import BaseInfo from '../components/edit/baseInfo';
import SubjectMatterForm from '../components/edit/SubjectMatterForm';
import SupplierInfo from '../components/edit/supplierInfo';
import MCDTable from './MCDTable';
export default function () {
    const [loading, toggleLoading] = useState(false);
    const formRef = useRef(null);
    const mcdRef = useRef(null);
    const { query } = router.useLocation();
    console.log('url路径', query)
    const handleBack = () => {
        closeCurrent()
    }
    return (
        <div>
            <Spin spinning={loading}>
                <Affix>
                    <div className={classnames(styles.fbc, styles.affixHeader)}>
                        <span className={styles.headTitle}>{query.pageStatus === 'add' ? `环保资料填报-xxx` : '环保资料填报明细-xxx'}</span>
                        <div>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                        </div>
                    </div>
                </Affix>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>基本信息</div>
                        <div className={styles.content}>
                            <BaseInfo />
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
                        <div className={styles.title}>供应商信息</div>
                        <div className={styles.content}>
                            <SupplierInfo wrappedComponentRef={formRef} />
                        </div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>填写说明</div>
                        <div className={styles.content}>
                            内容区
                        </div>
                    </div>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>MCD表</div>
                        <div className={styles.content}>
                            <MCDTable wrappedComponentRef={mcdRef} />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    )
}