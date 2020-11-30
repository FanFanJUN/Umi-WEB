import { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';
import { ExtModal, ExtTable } from 'suid';
import { Form } from 'antd';
import { Header } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { commonUrl } from '../../utils';
const { recommendUrl } = commonUrl;

const { create } = Form;

function LayoutComponent({
  form,
  title = '供应商推荐需求选择'
}, ref) {
  useImperativeHandle(ref, () => ({
    show,
    hide
  }))
  const [tableOptions, sets] = useTableProps();
  const {
    selectedRowKeys
  } = tableOptions;
  const {
    handleSelectedRows
  } = sets;
  const [visible, toggleVisible] = useState(false);
  const columns = [

  ]
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/supplierRecommendDemandService/findByPage4Access`,
      type: 'post'
    },
    remotePaging: true,
    checkbox: {
      multiSelect: false
    },
    allowCancelSelect: true,
    bordered: true,
    rowkey: 'id',
    size: 'small',
    columns: columns
  }
  const show = () => toggleVisible(true)
  const hide = () => toggleVisible(false)
  const left = (
    <>

    </>
  );
  return (
    <ExtModal
      visible={visible}
      title={title}
    >
      <Header
        left={left}
      />
      <ExtTable
        {...tableProps}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
      />
    </ExtModal>
  )
}

const FormWrapper = forwardRef(LayoutComponent)

export default create()(FormWrapper)