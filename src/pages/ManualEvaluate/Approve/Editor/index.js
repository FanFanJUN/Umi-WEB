/**
 * 实现功能： 供应商评价项目-人工评价
 * @author hezhi
 * @date 2020-10-15
 */
import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import { Affix, Button, Tabs, Spin, Upload, Modal, message } from 'antd';
import { useLocation } from 'dva/router';
import { Header, AutoSizeLayout } from '../../../../components';
import { downloadBlobFile, sendResize, checkToken, closeCurrent } from '../../../../utils';
import { ExtTable, WorkFlow } from 'suid';
import CommonForm from '../../../SupplierAppraise/CommonForm';
import { useTableProps } from '../../../../utils/hooks';
import { exportEvaluateData, queryEvaluateData, importEvaluateData, queryEvaluateApproveBaseDate } from '../../../../services/evaluate';
const { TabPane } = Tabs;
const { Approve } = WorkFlow;
function Evaluate() {
  const formRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const { query } = useLocation();
  const [loading, toggleLoading] = useState(false);
  const [tableState, sets] = useTableProps()
  const {
    dataSource
  } = tableState;
  const {
    setDataSource
  } = sets;
  const columns = [
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      width: 200
    },
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName',
      width: 200
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      width: 200
    },
    {
      title: '物料分类代码',
      dataIndex: 'materialCategoryCode'
    },
    {
      title: '物料分类名称',
      dataIndex: 'materialCategoryName',
      width: 250
    },
    {
      title: '原厂代码',
      dataIndex: 'originCode'
    },
    {
      title: '原厂名称',
      dataIndex: 'originName'
    },
    {
      title: '指标名称',
      dataIndex: 'samSupplierEvlSysRule.ruleName',
      width: 250
    },
    {
      title: '指标定义',
      dataIndex: 'samSupplierEvlSysRule.definition',
      width: 250
    },
    {
      title: '评价标准',
      dataIndex: 'samSupplierEvlSysRule.scoringStandard',
      width: 250
    },
    {
      title: '标准分',
      dataIndex: 'samSupplierEvlSysRule.highestScore'
    },
    {
      title: '评分人',
      dataIndex: 'scorerName'
    },
    {
      title: '分值',
      dataIndex: 'score'
    }
  ];
  const left = (
    <>
      <Button className={styles.btn} onClick={handleExportData}>导出</Button>
      <Upload
        showUploadList={false}
        beforeUpload={handleImport}
      >
        <Button className={styles.btn}>导入</Button>
      </Upload>
    </>
  )
  function handleExportData() {
    Modal.confirm({
      title: '导出评价指标模板',
      content: '是否导出当前评价指标模板',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { success, data, message: msg } = await exportEvaluateData({ evaluationProjectId: query?.id });
        if (success) {
          downloadBlobFile(data, '评价指标模板.xlsx')
          message.success(`导出评价指标模板成功`)
          return
        }
        message.error('导出评价指标模板失败')
      }
    })
  }
  async function handleImport(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('evaluationProjectId', query.id)
    toggleLoading(true)
    const { success, data, message: msg } = await importEvaluateData(formData)
    toggleLoading(false)
    if (success) {
      setDataSource(data)
      message.success('导入成功')
      return false
    }
    Modal.error({
      title: '导入错误',
      content: <div className={styles.errorBody}>{msg}</div>,
      okText: '知道了'
    })
    return false
  }
  async function initialTableDatasource() {
    toggleLoading(true)
    const { success, data, message: msg } = await queryEvaluateApproveBaseDate({
      subEvaluationProjectId: query?.id
    })
    toggleLoading(false)
    if (success) {
      formRef.current.setAllValues(data)
    } else {
      message.error(msg)
    }
    const { success: suc, data: ds, message: mes } = await queryEvaluateData({
      subEvaluationProjectId: query?.id
    })
    if (suc) {
      setDataSource(ds)
      return
    }
    message.error(mes)
  }
  useEffect(() => {
    checkToken(query, setIsReady)
  }, [])
  useEffect(() => {
    if (isReady) {
      initialTableDatasource()
    }
  }, [isReady])
  return (
    <Approve
      businessId={query?.id}
      taskId={query?.taskId}
      instanceId={query?.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={closeCurrent}
    >
      <Tabs
        animated={false}
        onChange={sendResize}
      >

        <TabPane tab='基本信息' key='base'>
          <Spin spinning={loading}>
            <CommonForm wrappedComponentRef={formRef} type='detail' initialize={false} />
          </Spin>
        </TabPane>
        <TabPane tab='评价指标' key='target' forceRender={true}>
          <Spin spinning={loading}>
            <div className={styles.commonTitle}>评价指标</div>
            <Header left={left} />
            <AutoSizeLayout>
              {
                h => (
                  <ExtTable
                    size='small'
                    dataSource={dataSource}
                    columns={columns}
                    height={h - 130}
                    rowKey={item => item.id}
                    showSearch={false}
                  />
                )
              }
            </AutoSizeLayout>
          </Spin>
        </TabPane>
      </Tabs>
    </Approve>
  )
}
export default Evaluate;