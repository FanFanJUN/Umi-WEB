import { useImperativeHandle, forwardRef, useRef, useState } from 'react';
import styles from './index.less';
import { AutoSizeLayout } from '../../../components';
import { ExtTable, ComboList, ComboTree } from 'suid';
import { useLocation } from 'dva/router';
import { Button, Upload, Form, Input, Select, Spin, Modal, message } from 'antd';
import { commonUrl, commonProps, downloadBlobFile } from '../../../utils';
import {
  evaluateResultLeaderExport, // 领导审核导出
  evaluateResultLeaderImport, // 领导审核导入
  evaluateResultTeamExport, // 采购小组审核导出
  evaluateResultTeamImport  // 采购小组审核导入
} from '../../../services/appraise';
import { useTableProps } from '../../../utils/hooks';
import PropTypes from 'prop-types';
const { recommendUrl } = commonUrl;
const { materialClassProps, dealAdviceProps } = commonProps;
const { Item, create } = Form;
const { Option } = Select;
const exportMethods = {
  'team': evaluateResultTeamExport,
  'leader': evaluateResultLeaderExport
}
const importMethods = {
  'team': evaluateResultTeamImport,
  'leader': evaluateResultLeaderImport
}

const CommonTable = forwardRef(({
  form,
  type = 'detail',
  columns = []
}, ref) => {
  useImperativeHandle(ref, () => ({

  }))
  const { query } = useLocation();
  const tableRef = useRef(null);
  const { getFieldDecorator, getFieldsValue } = form;
  const [tableState, sets] = useTableProps();
  const [loading, toggleLoading] = useState(false);
  const { searchValue } = tableState;
  const { setSearchValue } = sets;
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/seEvaluationResultService/findResultsByEvlProjectIdWithSearch?evaluationProjectId=${query?.id}`,
      type: 'POST',
      params: {
        ...searchValue,
        quickSearchProperties: ['supplierName', 'supplierCode']
      }
    },
    remotePaging: true,
    columns,
    ref: tableRef
  }
  function uploadTable() {
    tableRef.current.remoteDataRefresh();
  }
  function handleSearch() {
    const values = getFieldsValue();
    const { quickSearchValue, ...fields } = values;
    const keys = Object.keys(fields);
    const fls = keys.map(item => {
      const [operator, fieldName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!fieldName ? fields[item] : undefined
      }
    }).filter(item => !!item.value);
    setSearchValue({
      quickSearchValue,
      filters: fls
    })
    uploadTable()
  }
  // 导入
  async function handleImport(file) {
    const importMethod = importMethods[type];
    if (!importMethod) {
      return false
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('evaluationProjectId', query?.id)
    toggleLoading(true)
    const { success, message: msg } = await importMethod(formData);
    toggleLoading(false)
    if (success) {
      uploadTable()
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
  // 导出
  function handleExport() {
    const exportMethod = exportMethods[type];
    const fileName = type === 'leader' ? '供应商评价领导决策导入模板.xlsx' : '供应商评价采购小组意见导入模板.xlsx'
    if (!exportMethod) {
      return
    }
    Modal.confirm({
      title: '导出确认表',
      content: '是否导出当前确认表',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const { success, data, message: msg } = await exportMethod({ evaluationProjectId: query?.id });
        if (success) {
          downloadBlobFile(data, fileName)
          message.success(msg)
          return
        }
        message.error(msg)
      }
    })
  }
  return (
    <Spin spinning={loading}>
      <div>
        {
          type === 'detail' ? null : (
            <div>
              <Upload beforeUpload={handleImport} showUploadList={false}>
                <Button className={styles.btn}>导入</Button>
              </Upload>
              <Button className={styles.btn} onClick={handleExport}>导出</Button>
            </div>
          )
        }
        <div>
          <Form layout='inline'>
            <Item label='供应商'>
              {
                getFieldDecorator('quickSearchValue')(
                  <Input allowClear />
                )
              }
            </Item>
            <Item label='物料分类'>
              {
                getFieldDecorator('EQ_materialCategoryCode'),
                getFieldDecorator('materialCategoryName')(
                  <ComboTree
                    {...materialClassProps}
                    form={form}
                    allowClear
                    name='materialCategoryName'
                    field={['EQ_materialCategoryCode']}
                    style={{
                      width: 200
                    }}
                  />
                )
              }
            </Item>
            <Item label='等级'>
              {
                getFieldDecorator('EQ_grade')(
                  <Select style={{ width: 100 }} allowClear>
                    <Option value='A' label='A'>A</Option>
                    <Option value='B' label='B'>B</Option>
                    <Option value='C' label='C'>C</Option>
                    <Option value='D' label='D'>D</Option>
                    <Option value='E' label='E'>E</Option>
                  </Select>
                )
              }
            </Item>
            <Item label='处理建议'>
              {
                getFieldDecorator('EQ_dealAdviceValue'),
                getFieldDecorator('dealAdviceName')(
                  <ComboList
                    {...dealAdviceProps}
                    name='dealAdviceName'
                    field={['EQ_dealAdviceValue']}
                    form={form}
                    style={{ width: 150 }}
                    allowClear
                  />
                )
              }
            </Item>
            <Item>
              <Button type='primary' onClick={handleSearch}>查询</Button>
            </Item>
          </Form>
        </div>
      </div>
      <AutoSizeLayout>
        {
          h => (
            <ExtTable height={h - 65} showSearch={false} {...tableProps} />
          )
        }
      </AutoSizeLayout>
    </Spin>
  )
})

CommonTable.propTypes = {
  columns: PropTypes.array,
  type: PropTypes.string
}

export default create()(CommonTable)