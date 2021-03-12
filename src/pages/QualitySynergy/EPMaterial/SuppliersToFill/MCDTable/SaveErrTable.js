import { useRef, Fragment } from 'react';
import { ExtTable, utils } from 'suid';

const { getUUID } = utils;

export default function supplierModal (props) {
  const tableRef = useRef(null);
  const columns = [
    { title: '拆分部位行号', dataIndex: 'splitPartsLineNumber', },
    { title: '环保标准名称', dataIndex: 'environmentalProtectionName', ellipsis: true, },
    { title: '拆分部件名称', dataIndex: 'splitPartsName', ellipsis: true, },
    { title: '均质材料名称', dataIndex: 'homogeneousMaterialName', ellipsis: true, },
    { title: '限用物资名称集合', dataIndex: 'materialNames', render: (text) => text.join(',') },
  ].map(item => ({ ...item, align: 'center', ellipsis: true }));


  return (<Fragment>
    <ExtTable
      columns={columns}
      bordered
      allowCancelSelect
      showSearch={false}
      ref={tableRef}
      checkbox={false}
      rowKey={(item) => item.uuid}
      size='small'
      dataSource={props.data.map(item => ({ ...item, uuid: getUUID() }))}
    />
  </Fragment>)
}