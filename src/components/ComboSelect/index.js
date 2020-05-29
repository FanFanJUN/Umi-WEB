import React, {
  useState,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import { ExtTable } from 'suid';
import { Popover, Input } from 'antd';
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
  const { name: readeName = 'id', field: readField = ['id'] } = reader;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const { setFieldsValue } = form;
  const [valueText, setValueText] = useState("")
  function handleSelectedRow(keys, rows) {
    setSelectedKeys(keys)
    // setValueText(joinVal)
    if (!!setFieldsValue) {
      setFieldsValue({
        [name]: keys
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
    onChange(keys)
    onRowsChange(rows)
  }
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
          <div>
            <ExtTable
              store={store}
              toolBar={{
                layout:{
                  leftSpan: 0,
                  rightSpan: 24
                }
              }}
              columns={columns}
              rowKey={(item) => item[readeName]}
              selectedRowKeys={selectedKeys}
              onSelectRow={handleSelectedRow}
              showSearch={true}
              height={300}
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