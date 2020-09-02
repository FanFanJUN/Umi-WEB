import { useRef, useState } from 'react';
import { Affix, Button, message, Spin } from 'antd';
import { closeCurrent } from '../../../../utils';
export default function () {
    const [loading, toggleLoading] = useState(false);
    const formRef = useRef(null);
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
                        <span>新增采购会计视图变更单</span>
                        <div>
                            <Button className={styles.btn} onClick={handleBack}>返回</Button>
                            <Button className={styles.btn} type='primary' onClick={handleSave}>保存</Button>
                        </div>
                    </div>
                </Affix>
                <CommonForm wrappedComponentRef={formRef} />
            </Spin>
        </div>
    )
}