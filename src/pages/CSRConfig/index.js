import { useState } from 'react';
import styles from './index.less';
import { Header, AutoSizeLayout } from '../../components';
import { Button, Input, Modal } from 'antd';
import { ExtTable, ExtModal } from 'suid';
import DataForm from './DataForm';

const { Search } = Input

function CSRConfig() {
  const [modalInfo, setModalInfo] = useState({
    visible: false,
    type: 'add',
    id: null
  });
  const left = (
    <>
      <Button className={styles.btn} type='primary'>新增</Button>
      <Button className={styles.btn}>编辑</Button>
      <Button className={styles.btn}>删除</Button>
    </>
  )
  const right = (
    <>
      <Search />
    </>
  )
  const tableProps = {
    showSearch: false,
    columns: [
      {
        title: '调查项目',
        dataIndex: 'item'
      },
      {
        title: '选项配置',
        dataIndex: 'selectConfigList'
      },
      {
        title: '是否包含备注',
        dataIndex: 'remarkConfig',
        render(text) {
          return text ? '是' : '否'
        }
      },
      {
        title: '是否包含附件',
        dataIndex: 'attachmentConfig',
        render(text) {
          return text ? '是' : '否'
        }
      },
      {
        title: '类型',
        dataIndex: 'csrConfigEnum',
        render(text) {
          switch (text) {
            case "CSR":
              return '企业社会责任'
            case "PRODUCTION_ENVIRONMENT":
              return '企业生产环境'
          }
        }
      },
      {
        title: '排序号',
        dataIndex: 'rank'
      }
    ]
  }
  return (
    <div>
      <Header left={left} right={right} />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable height={h} {...tableProps} />
          )
        }
      </AutoSizeLayout>

      <Modal
        visible={true}
        destroyOnClose
        centered
        width={`60vw`}
      >
        <DataForm />

      </Modal>
    </div>
  )
}

export default CSRConfig;