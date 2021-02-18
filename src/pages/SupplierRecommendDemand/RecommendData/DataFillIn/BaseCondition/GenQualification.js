/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:29:41
 * @LastEditTime: 2020-09-16 15:08:48
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/GenQualification.js
 * @Description: 通用资质 Table
 * @Connect: 1981824361@qq.com
 */
import { useRef, Fragment } from 'react'
import { ExtTable } from 'suid';
import moment from 'moment';
import UploadFile from '../../../../../components/Upload';

export default function ({ tableData }) {
  const columns = [
    {
      title: '资质文件类型',
      dataIndex: 'qualificationType',
      ellipsis: true,
    },
    {
      title: '证件编号',
      dataIndex: 'certificateNo',
      ellipsis: true,
    },
    {
      title: '发证机构',
      dataIndex: 'institution',
      ellipsis: true,
    },
    {
      title: '有效期',
      dataIndex: 'date',
      ellipsis: true,
      render: function (text, record) {
        return record.startDate && `${moment(record.startDate).format('YYYY-MM-DD')} ~ ${moment(record.endDate).format('YYYY-MM-DD')}`;
      },
      width: 212
    },
    {
      title: '附件',
      dataIndex: 'id',
      ellipsis: true,
      render: function (text, context) {
        return <UploadFile entityId={text} type='show' />
      }
    },
  ].map(item => ({ ...item, align: 'center' }));
  return <Fragment>
    <div>
      <ExtTable
        columns={columns}
        bordered
        allowCancelSelect
        showSearch={false}
        remotePaging
        rowKey={(item) => item.id}
        size='small'
        dataSource={tableData}
      />
    </div>
  </Fragment>
}