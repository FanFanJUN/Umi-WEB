import React, {
  useState,
  forwardRef,
  useRef,
  useEffect,
  useCallback
} from 'react';
import { ExtTable } from 'suid';
import { Popover, Tag } from 'antd';
import request from '../../utils/request';
const ComboSelect = forwardRef(({
  columns = [],
  store = {},
  onChange = () => null,
  onRowsChange = () => null,
  name = 'id',
  field = [],
  multiple = true,
  placeholder = 'éæŠčå´',
  form = {},
  reader = {},
  disabled = false,
  forExtra = false,
  value = []
}, ref) => {
  const wrapperRef = useRef(null)
  const { name: readName = 'id', field: readField = ['id'] } = reader;
  const [fieldKeyCode] = readField;
  const [fk] = field;
  const [rdk] = readField;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  // const [tabList, setTabList] = useState([]);
  const { setFieldsValue, getFieldValue } = form;
  function getDataSource() {
    const { url, params } = store;
    request.post(url, params).then(({ data: response }) => {
      const { rows = [] } = response;
      setDataSource(rows)
      const ks = getFieldValue(fk) || [];
      setSelectedKeys(ks)
    })
  }
  function handleSelectedRow(keys, rows) {
    setSelectedKeys(keys)
    // const names = rows.map(item => item[readName])
    if (!!setFieldsValue) {
      setFieldsValue({
        [name]: rows
      });
      const fieldValues = readField.map(item => {
        return rows.map(i => i[item]);
      })
      field.forEach((item, k) => {
        setFieldsValue({
          [item]: fieldValues[k]
        })
      })
    }
    onChange(rows)
    onRowsChange(rows)
  }
  function handleCloseTab(item) {
    const ks = selectedKeys.filter(i => i !== item[rdk]);
    setSelectedKeys(ks)
    const fds = dataSource.filter(i => ks.findIndex(item => item === i[rdk]) !== -1)
    handleSelectedRow(ks, fds)
  }
  useEffect(() => {
    getDataSource()
  }, [])
  const sk = value.map(item => item[rdk])
  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative' }}
    >
      <Popover
        trigger='click'
        placement="bottomRight"
        autoAdjustOverflow={false}
        content={
          <div style={{ height: 300 }}>
            <ExtTable
              dataSource={dataSource}
              toolBar={{
                layout: {
                  leftSpan: 0,
                  rightSpan: 24
                }
              }}
              columns={columns}
              rowKey={(item) => item[fieldKeyCode]}
              selectedRowKeys={sk}
              onSelectRow={handleSelectedRow}
              showSearch={true}
              width={400}
              lineNumber={false}
              allowCustomColumns={false}
              checkbox={multiple}
            />
          </div>
        }
      >
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: 5,
          padding: '0 12px',
          cursor: disabled ? 'no-drop' : 'pointer',
          background: disabled ? '#fafafa' : '',
          flexWrap: 'wrap',
          minHeight: 32
        }}>
          {
            value.length === 0 ? <div style={{ color: '#ccc', height: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{placeholder}</div> : null
          }
          {
            value.map((item, index) => <Tag key={`${index}-tab-value`} style={{
              margin: 5
            }} closable onClose={() => handleCloseTab(item)} visible={true}>{`${item[rdk]} ${item[readName]}`}</Tag>)
          }
        </div>
      </Popover>
    </div>
  )
})

export default ComboSelect;