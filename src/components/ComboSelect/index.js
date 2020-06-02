import React, {
  useState,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import { ExtTable } from 'suid';
import { Popover, Input } from 'antd';
import request from '../../utils/request';
const { Search } = Input
const ComboSelect = forwardRef(({
  columns = [],
  store = {},
  onChange = () => null,
  onRowsChange = () => null,
  name = 'id',
  field = [],
  multiple = true,
  placeholder = '选择范围',
  form = {},
  reader = {},
  value = []
}, ref) => {
  const wrapperRef = useRef(null)
  const { name: readName = 'id', field: readField = ['id'] } = reader;
  const [ fieldKeyCode ] = readField;
  const [fk] = field;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const { setFieldsValue, getFieldValue } = form;
  const [valueText, setValueText] = useState("");
  function getDataSource() {
    const { url, params } = store;
    request.post(url, params).then(({ data: response })=>{
      const { rows=[] } = response;
      setDataSource(rows)
      const ks = getFieldValue(fk);
      setSelectedKeys(ks)
    })
  }
  function handleSelectedRow(keys, rows) {
    setSelectedKeys(keys)
    const names = rows.map(item=>item[readName])
    if (!!setFieldsValue) {
      setFieldsValue({
        [name]: names
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
    onChange(names)
    onRowsChange(rows)
  }
  useEffect(() => {
    getDataSource()
  }, [])
  useEffect(() => {
    const v = value.join('，')
    setValueText(v)
  }, [value])
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
                layout:{
                  leftSpan: 0,
                  rightSpan: 24
                }
              }}
              columns={columns}
              rowKey={(item) => item[fieldKeyCode]}
              selectedRowKeys={selectedKeys}
              onSelectRow={handleSelectedRow}
              showSearch={true}
              // height={300}
              width={400}
              lineNumber={false}
              allowCustomColumns={false}
              checkbox={multiple}
            />
          </div>
        }
      >
        <Input
          ref={ref}
          readOnly
          placeholder={placeholder}
          value={valueText}
        />
      </Popover>
    </div>
  )
})

export default ComboSelect;