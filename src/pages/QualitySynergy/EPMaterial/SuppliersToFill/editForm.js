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
import { supplerFindVoById } from '../../../../services/qualitySynergy'
export default function () {
    const [loading, toggleLoading] = useState(false);
    const [originData, setOriginData] = useState({})
    const formRef = useRef(null);
    const mcdRef = useRef(null);
    const { query } = router.useLocation();
    const handleBack = () => {
        closeCurrent();
    }
    const handleSave = (publish) => {
    }
    useEffect(() => {
        (async function () {
            // toggleLoading(true);
            const res = await supplerFindVoById({ id: query.id });
            if(res.success) {
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
                        <span className={styles.headTitle}>{query.pageStatus === 'add' ? `环保资料填报-xxx` : '环保资料填报明细-xxx'}</span>
                        {
                            query.pageStatus === 'detail' ? <div>
                                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            </div> : <div>
                                    <Button className={styles.btn} onClick={handleSave}>保存</Button>
                                    <Button className={styles.btn} type="primary" onClick={() => { handleSave(true) }}>保存并提交</Button>
                                </div>
                        }
                    </div>
                </Affix>
                <div className={styles.wrapper}>
                    <div className={styles.bgw}>
                        <div className={styles.title}>基本信息</div>
                        <div className={styles.content}>
                            <BaseInfo isView={true} originData={originData} />
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
                            <SupplierInfo wrappedComponentRef={formRef} originData={originData} />
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
                            <MCDTable wrappedComponentRef={mcdRef} originData={originData}/>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    )
}