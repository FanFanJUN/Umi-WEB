import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import classnames from 'classnames';
import ImportBaseInfo from '../commons/ImportBaseInfo'
import ImportData from '../commons/ImportData'
import styles from '../../supplierRegister/components/index.less';
import { closeCurrent, isEmpty } from '../../../utils';
import { RecommendationList, saveBatchVo } from '../../../services/SupplierBatchExtend'
function CreateStrategy() {
    const BaseinfoRef = useRef(null);
    const DatainfoRef = useRef(null);

    const [dataSource, setDataSource] = useState([]);

    const [loading, triggerLoading] = useState(false);
    const [visible, setvisible] = useState(false);
    const [configure, setConfigure] = useState([]);
    const { query } = router.useLocation();

    // 详情
    async function Importdetails() {
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
    // 保存
    async function handleSave() {
        const { getImportBaseInfo } = BaseinfoRef.current; // 基本信息
        const { getImportDate } = DatainfoRef.current; // 供应商
        let ImportBaseInfo = getImportBaseInfo();
        let ImportDate = getImportDate();
        if (!ImportBaseInfo) {
            message.error('请将基本信息填写完全！');
            return false;
        }
        let params = { ...dataSource, ...ImportBaseInfo, ...ImportDate }
        const { success, message: msg } = await saveBatchVo(params)
        if (success) {
            triggerLoading(false)
            closeCurrent()
        } else {
            triggerLoading(false)
            message.error(msg);
        }
    }

    // 获取配置列表项
    useEffect(() => {
        Importdetails()
    }, []);
    // 返回
    function handleBack() {
        closeCurrent()
    }

    return (
        <Spin spinning={loading} tip='处理中...'>
            <Affix offsetTop={0}>
                <div className={classnames([styles.header, styles.flexBetweenStart])}>
                    <span className={styles.title}>
                        编辑
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
                        <ImportBaseInfo
                            dataSource={dataSource}
                            wrappedComponentRef={BaseinfoRef}
                        />
                    </div>
                </div>
                <div className={styles.bgw}>
                    <div className={styles.title}>扩展采购会计视图</div>
                    <div >
                        <ImportData
                            editData={dataSource.supplierFinanceViews}
                            wrappedComponentRef={DatainfoRef}
                            isEdit={query.isEdit}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default CreateStrategy;