/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:29:41
 * @LastEditTime: 2020-09-16 15:08:48
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/GenQualification.js
 * @Description: 通用资质 Table
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button } from 'antd';
import EditableFormTable from '../CommonUtil/EditTable';
import moment from 'moment';
import UploadFile from '../CommonUtil/UploadFile';

export default function ({ tableData }) {
  const tableRef = useRef(null);
  const columns = [
    { title: '资质文件类型', dataIndex: 'qualificationType', ellipsis: true, },
    { title: '证照编号', dataIndex: 'certificateNo', ellipsis: true, },
    { title: '发证机构', dataIndex: 'institution', ellipsis: true, },
    {
      title: '有效期', dataIndex: 'date', ellipsis: true, render: function (text, record) {
        return record.startDate && `${moment(record.startDate).format('YYYY-MM-DD')} ~ ${moment(record.endDate).format('YYYY-MM-DD')}`;
      }, width: 212
    },
    {
      title: '附件', dataIndex: 'attachments', ellipsis: true, render: function (text, context) {
        return <UploadFile entityId={text} type='show' />
      }
    },
  ].map(item => ({ ...item, align: 'center' }));
  return <Fragment>
    <div>
      <EditableFormTable
        columns={columns}
        bordered
        allowCancelSelect
        showSearch={false}
        remotePaging
        checkbox={{ multiSelect: false }}
        ref={tableRef}
        rowKey={(item) => item.id}
        size='small'
        dataSource={tableData}
      />
    </div>
  </Fragment>
}