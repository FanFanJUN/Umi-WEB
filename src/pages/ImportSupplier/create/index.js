import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import classnames from 'classnames';
import ImportBaseInfo from '../commons/ImportBaseInfo'
import ImportData from '../commons/ImportData'
import styles from '../../supplierRegister/components/index.less';
import { closeCurrent, isEmpty } from '../../../utils';
import { RecommendationList } from '../../../services/ImportSupplier'
import { utils} from 'suid';
function CreateStrategy() {
    const BaseinfoRef = useRef(null);
    const DatainfoRef = useRef(null);
    const [dataSource, setDataSource] = useState([]);
    const [loading, triggerLoading] = useState(false);
    const { storage } = utils;
    const { query } = router.useLocation();
    const authorizations = storage.sessionStorage.get("Authorization");
    // 保存
    async function handleSave() {
        const { getImportBaseInfo } = BaseinfoRef.current; // 基本信息
        const {getImportDate} = DatainfoRef.current; // 供应商
        let ImportBaseInfo = getImportBaseInfo();
        let ImportDate = getImportDate();
        if (!ImportBaseInfo) {
          message.error('请将基本信息填写完全！');
          return false;
        }
        ImportBaseInfo.applyName = authorizations.userName
        console.log(ImportBaseInfo)
        console.log(ImportDate)
    }

    // 获取配置列表项
    useEffect(() => {

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
                        新增
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
                            wrappedComponentRef={BaseinfoRef}
                        />
                    </div>
                </div>
                <div className={styles.bgw}>
                    <div className={styles.title}>新增供应商</div>
                    <div >
                        <ImportData
                            wrappedComponentRef={DatainfoRef}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default CreateStrategy;