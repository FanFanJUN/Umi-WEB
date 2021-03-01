# 带编辑、新增、删除、导入、导出功能的列表组件

|参数名称|参数说明|参数类型|默认值|
|:----------|:----------|:-------|:--------|:-------|
|allowCreate|是否显示新增按钮|Boolean|true|
|allowEditor|是否显示编辑按钮|Boolean|true|
|allowRemove|是否显示删除按钮|Boolean|true|
|allowOperation|列表项是否可选|Boolean|true|
|allowImport|是否显示导入按钮|Boolean|false|
|allowExport|是否显示导出按钮|Boolean|false|
|copyLine|新增时是否复制已有行|Boolean|false|
|copyFields|新增时复制已有行的对应字段|Array|[productCode,productName]|
|validateFunc|导入时数据检查回调|Function|(data: 已导入数据)=>void|
|validateLoading|导入或检查数据时按钮loading|Boolean|false|
|exportFunc|导出数据回调|Function|()=>void|
|setDataSource|修改列表数据方法（修改dataSource的方法）|Function|()=>void|
|fields|ModalFields配置(详见ModalFields组件)|Array|[]|
|mode|列表状态(create或detail)，detail下所有按钮不可用|String|create|
|beforeEditor|编辑状态确认按钮点击前回调|Promise|(row:当前编辑行)=>void




