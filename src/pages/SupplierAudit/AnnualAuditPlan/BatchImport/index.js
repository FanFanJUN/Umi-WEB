/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2020-12-28 10:14:41
 * @LastEditors  : LiCai
 * @LastEditTime : 2020-12-28 11:15:11
 * @Description  : 批量导入
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/BatchImport/index.js
 */

import { Button, message, Modal, Row, Upload } from "antd";
import { Fragment, useState } from "react";
import { ExtTable } from "suid";
import ExportButtonRe from "./ExportButtonRe";

 const BatchImport = props => {
   const { columns, params, action, downLoadUrl, downMethod, callback, disabled } = props;

   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [visible, setVisible] = useState(false);
   const [dataSource, setDataSource] = useState([]);
   const [fileList, setFileList] = useState(null);

   function toggleModal() {
     setData([]);
     setVisible(!visible);
   }

   function handleOk() {
     callback(data); //导入的回调事件
     toggleModal();
   }

   function beforeUpload (file) {
    let sindex = file.name.lastIndexOf(".");
    let ext = file.name.substring(sindex + 1, file.name.length);
    if (sindex < 0) {
        message.error("请上传excel文件");
        return false;
    } else {
        if (ext !== 'xls' && ext !== 'xlsx') {
            message.error("请上传excel文件");
            return false;
        } else {
            this.setState(({fileList}) => ({
                fileList: [...fileList, file],
            }));
        }
    }
};

   const title = () => (
     <div>
       <Row>
         <Upload
           //   name={name} //发到后台的文件参数名
           data={params} //上传所需参数
           action={action} //上传的地址
           showUploadList={false}
           style={{ width: '100%' }}
           fileList={fileList}
           beforeUpload={beforeUpload}
           onChange={res => this.handleChange(res)}
         >
           <Button style={{ marginLeft: 5 }} key="chooseFile" loading={loading}>
             选择文件
           </Button>
         </Upload>

         <ExportButtonRe
           type='primary'
           api={downLoadUrl}
           object={{}}
           params={params}
           fileName={'年度审核计划导入模板.xlsx'}
           method={downMethod}
           btnName={'模板下载'}
         />
       </Row>
     </div>
   );

   return (
     <Fragment>
       <Button style={{ marginLeft: '5px', marginRight: '15px' }} onClick={toggleModal} disabled={disabled}>
         批量导入
       </Button>
       <Modal
         width={'75%'}
         title="批量导入"
         centered
         destroyOnClose
         maskClosable={false}
         bodyStyle={{ padding: 12 }}
         visible={visible}
         confirmLoading={loading}
         onOk={handleOk}
         onCancel={toggleModal}
       >
         <div>
           <Row style={{ padding: 5 }}>{title()}</Row>
           <ExtTable
             style={{ marginTop: '10px' }}
             rowKey="reviewPlanYearLinenum"
             allowCancelSelect={true}
             showSearch={false}
             remotePaging
             size="small"
             columns={columns}
             dataSource={dataSource}
           />
         </div>
       </Modal>
     </Fragment>
   );
 };

 export default BatchImport;