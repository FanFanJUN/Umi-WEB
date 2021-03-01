## 弹出式Form表单
|参数名称|参数说明|参数类型|默认值|
|:-----|:-----|:-----|:-----|
|type| 弹出时显示的title类型 create 或 eidtor | String | create|
|copyFields|需要在打开时赋值的字段|Array| []|
|createTitle| type为create时显示的弹窗标题[可通过传入Modal的title属性覆盖]|String|ReactNode| 新增数据|
|editorTitle| type为editor时显示的弹窗标题[可通过传入Modal的title属性覆盖]|String|ReactNode| 新增数据|
|fields|表单配置项（见下表）|Array|[]|
- 其他参数同antd Modal组件

- fields配置

|参数名称|参数说明|参数类型|默认值|
|:-----|:-----|:-----|:-----|
|name|对应Form getFieldDecorator name| String | |
|label| Form.Item label属性 |String| |
|options|对应Form getFieldDecorator options, validator属性除rule,value,callback三个参数外，新增targetValue, getFieldsValue两个参数targetValue对应disabledTarget获取到的表单值，getFieldsValue为Form组件对应的getFieldsValue方法，required属性支持为一个Function，参数为disabledTargetValue, getFieldsValue|Object|{}|
|fieldType|表单项类型，支持[input, textArea, comboList, comboGrid, datePicker, yearPicker, uploadFile, inputNumber, select]|String| input|
|props|表单项对应类型组件props|Object|{}|
|disabledTarget| 组件disabled状态的依赖项对应name|String|当前name| 
|disabledDate|datePicker, yearPicker组件禁用时间|Function|(currentDate:当前时间, moment:moment实例, targetValue: disabledTarget对应表单项的值, otherTargetValue[]：otherTargetFields对应的值)=> null|
|disabledTargetValue|当传入该值时，disabledTarget失效，disabled属性为Function时该值做为第一个参数|any| null|
|changeResetFields|当表单值变更时要重置的表单项目前仅支持type为select、datePicker、yearPicker的组件|[]name| []|
|otherTargetFields|disabled,disabledDate为Function时最后一个参数要获取的当前表单值对应name|[]name| []|
|selectOptions| 当组件类型为select时的选项配置|[]select props (value, name) | [{value: true, name: 是},{value: false, name: 否}]|
|props|表单组件对应props,disabled属性支持传入一个Function(targetValue: disabledTarget字段对应的表单值, otherTargetValue: otherTargetfields对应的所有表单值)=> Boolean, |Object|{}|




