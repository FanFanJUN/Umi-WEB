// 导出最大限制

import React from 'react';
import { Button, message } from 'antd';
import httpUtils from '@/utils/FeatchUtils';
import { baseUrl } from '@/utils/commonUrl';
import { DataExport, utils } from 'suid';
const { getUUID } = utils;

class ExportMaxLenBtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      exportMaxLength: null,
      id: getUUID()
    }
  }

  //获取文件导出最大数量
  async getExportMaxLength () {
    return await httpUtils.get(`${baseUrl}/srmCommon/getSrmExportLimit`);
  }

  async handleGetExportMaxLength () {
    const { tableRef } = this.props;
    const { exportMaxLength, id } = this.state;
    let maxLenth = exportMaxLength;
    let records = tableRef ? (tableRef.current.state.pagination.total || 0) : 0;
    if (!records) {
      return message.warning('无数据可导出')
    }
    if (exportMaxLength === null) {
      this.setState({
        loading: true,
      })
      try {
        let data = await this.getExportMaxLength()
        if (!data.success) {
          message.error(data.message)
          throw new String(data.message);
        } else {
          maxLenth = data.data;
          this.setState({
            loading: false,
            exportMaxLength: maxLenth
          })
        }
      } catch (err) {
        this.setState({
          loading: false,
        })
        return false
      }
    }
    if (records > maxLenth) {
      return message.warning('导出数据已超过系统限制，请联系管理员。')
    }
    document.getElementById(id).click()
  }

  render () {
    const { loading, id } = this.state;
    const { tableRef, requestParams, explainResponse, filenameFormat, ...ownProperty } = this.props;
    return (
      <>
        <Button
          loading={loading}
          onClick={() => {
            this.handleGetExportMaxLength()
          }}
          {...ownProperty}
        >{this.props.children || '导出'}
        </Button>
        <DataExport.Button
          style={{ 'display': 'none' }}
          requestParams={requestParams}
          explainResponse={explainResponse}
          filenameFormat={filenameFormat}
          id={id}
        />
      </>
    )
  }
}

export default ExportMaxLenBtn;
