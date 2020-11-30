/**
 * 实现功能： 供应商评价项目-分配评审人
 * @author hezhi
 * @date 2020-09-23
 */
import { useState, useEffect } from 'react';
import styles from './index.less';
import { Upload, Button, Modal, message, Spin } from 'antd';
import { ExtTable, utils } from 'suid';
import { Header, AutoSizeLayout } from '../../../components';
import { useLocation } from 'dva/router';
import { findScoreById, exportEvlProjectScorer, importEvlProjectScorer, sponsorAppraise } from '../../../services/appraise';
import { downloadBlobFile, sendResize, closeCurrent } from '../../../utils';

function Allocation() {
  const { query } = useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [tableKey, setTableKey] = useState('initialTableKey-allocation');
  const [loading, toggleLoading] = useState(false);
  const columns = [
    {
      title: '类别',
      dataIndex: 'systemName',
      width: 200
    },
    {
      title: '指标名称',
      dataIndex: 'ruleName',
      width: 250
    },
    {
      title: '指标定义',
      dataIndex: 'definition',
      width: 250
    },
    {
      title: '业务单元代码',
      dataIndex: 'buCode'
    },
    {
      title: '业务单元名称',
      dataIndex: 'buName'
    },
    {
      title: '评审人',
      dataIndex: 'scorerName',
      render(text, record) {
        if (!text) return ''
        return `${record.scorerCode}   ${text}`
      }
    }
  ]
  const left = (
    <>
      <Button className={styles.btn} onClick={handleExportData}>导出</Button>
      <Upload
        beforeUpload={handleImport}
        showUploadList={false}
      >
        <Button className={styles.btn}>导入</Button>
      </Upload>
    </>
  );
  function handleExportData() {
    Modal.confirm({
      title: '导出分配评审人',
      content: '是否导出当前评价项目陪审人配置表',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { success, data, message: msg } = await exportEvlProjectScorer({ evaluationProjectId: query?.id });
        if (success) {
          downloadBlobFile(data, '评审人分配模板.xlsx')
          message.success('导出成功')
          return
        }
        message.error(msg)
      }
    })
  }
  function handleAppraise() {
    Modal.confirm({
      title: '发起评价',
      content: '确定当前项目要发起评价吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await sponsorAppraise({
          evaluationProjectId: query?.id
        })
        if (success) {
          closeCurrent()
          return
        }
        message.error(msg)
      }
    })
  }
  async function handleImport(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('evaluationProjectId', query.id)
    toggleLoading(true)
    const { success, data, message: msg } = await importEvlProjectScorer(formData)
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
  async function initialDataSource() {
    toggleLoading(true)
    const { success, data, message: msg } = await findScoreById({
      evaluationProjectId: query?.id
    })
    toggleLoading(false)
    if (success) {
      await setDataSource(data);
      const uuid = utils.getUUID();
      await setTableKey(uuid)
      sendResize()
      return
    }
  }
  function back() {
    closeCurrent()
  }
  useEffect(() => {
    initialDataSource()
  }, [])
  return (
    <Spin spinning={loading}>
      <div className={styles.affixHeader}>
        <div className={styles.fbc}>
          <span className={styles.title}>分配评审人</span>
          <div>
            <Button className={styles.btn} onClick={handleAppraise}>发起评价</Button>
            <Button onClick={back}>返回</Button>
          </div>
        </div>
      </div>
      <Header left={left} />
      <AutoSizeLayout>
        {
          h =>
            <ExtTable
              key={tableKey}
              showSearch={false}
              rowKey={(item) => item?.key}
              defaultExpandAllRows={true}
              dataSource={dataSource}
              height={h}
              pagination={false}
              columns={columns}
            />
        }
      </AutoSizeLayout>
    </Spin>
  )
}

export default Allocation;