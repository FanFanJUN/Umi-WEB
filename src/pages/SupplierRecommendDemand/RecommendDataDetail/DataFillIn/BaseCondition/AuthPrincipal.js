/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 11:25:57
 * @LastEditTime: 2020-09-16 15:10:00
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/AuthPrincipal.js
 * @Description: 授权委托人 Table
 * @Connect: 1981824361@qq.com
 */
import { useRef, Fragment } from 'react'
import EditableFormTable from '../CommonUtil/EditTable';

export default function ({ tableData }) {
  const tableRef = useRef(null);

  const columns = [
    { title: '职务', dataIndex: 'positionName', ellipsis: true, },
    { title: '联系人', dataIndex: 'name', ellipsis: true, },
    { title: '身份证号', dataIndex: 'idNo', ellipsis: true, width: 182 },
    { title: '手机', dataIndex: 'mobile', ellipsis: true, },
    { title: '邮箱', dataIndex: 'email', ellipsis: true, width: 178 },
    { title: '电话', dataIndex: 'telephone', ellipsis: true, },
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