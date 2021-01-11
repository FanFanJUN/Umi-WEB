import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { router } from 'dva';
import { message, Tabs, Spin, Affix } from 'antd';
import ImportBaseInfo from '../commons/ImportBaseInfo'
import ImportData from '../commons/ImportData'
import { closeCurrent, checkToken } from '../../../utils/index';
import { RecommendationList } from '../../../services/SupplierBatchExtend'
import styles from '../index.less';
function SupplierApproveInfo() {
    const BaseinfoRef = useRef(null);
    const DatainfoRef = useRef(null);
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    const [loading, triggerLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        initsupplierDetai();
    }, []);
    // 无账号详情
    async function initsupplierDetai() {
        triggerLoading(true)
        const { data, success, message: msg } = await RecommendationList({ id: query.id })
        if (success) {
            triggerLoading(false)
            setDataSource(data)
        } else {
            message.error(msg);
            triggerLoading(false)
        }
    }

    return (
        <Spin spinning={loading} tip='处理中...'>
            <div className={styles.wrapper}>
                <div className={styles.bgw}>
                    <div className={styles.title}>基本信息</div>
                    <div >
                        <ImportBaseInfo
                            wrappedComponentRef={BaseinfoRef}
                            dataSource={dataSource}
                            isView={true}
                        />
                    </div>
                </div>
                <div className={styles.bgw}>
                    <div className={styles.title}>扩展采购会计视图</div>
                    <div >
                        <ImportData
                            editData={dataSource.supplierFinanceViews}
                            wrappedComponentRef={DatainfoRef}
                            isEdit={true}
                            headerInfo={true}
                            isView={true}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default SupplierApproveInfo
