import styles from './index.less';
import { ExtTable } from 'suid';
import { router } from 'dva';
import { recommendUrl } from '../../../../utils/commonUrl';

const { useLocation } = router;

function Explain() {
  const { query } = useLocation()
  const columns = [
    {
      title: '公司',
      dataIndex: 'corporationName',
      width: 250
    },
    {
      title: '采购组织',
      dataIndex: 'purchaseOrgName',
      width: 250
    },
    {
      title: '产品名称',
      dataIndex: 'materialCategoryName',
      width: 150
    }
  ]
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/SupplierRecommendDemandLineService/findRecommendProductList?supplierRecommendDemandId=${query?.id}`,
      type: 'POST',
      params: {
        supplierRecommendDemandId: query?.id
      }
    },
    remotePaging: true
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.commonTitle}>填表说明</div>
      <ul className={styles.ul}>
        <li className={styles.ulItem}>
          本调查表为双方合作前对供应商整体状况的调查，请务必认真、如实填写。填写之前，请仔细研阅填表说明：
        </li>
        <li className={styles.ulItem}>
          1. 本调查表为供应商体系的整体概括，直接影响我司对贵司的评价，请务必准确全面填写;
        </li>
        <li className={styles.ulItem}>
          2. 填写此调查表时，若需添加附页，附页纸张大小必须与本调查表相同，表格格式、项目、内容等亦必须与调查表中的完全一致，并在附页上加盖公章确认；
        </li>
        <li className={styles.ulItem}>
          3. 认证证书包括ISO9001、RoHS认证、ISO14001、QC08000、ISO45001、ISO27001、UL、VDE、EMC、CCC、CE等所有认证；
          4.请将所有项目进行填写，无相关信息不能填写的请出具盖公章的说明资料；
        </li>
        <li className={styles.ulItem}>
          4. 本调查表在如实填写后，首先将电子版提交长虹采购供应链中心。根据供应商填写的基本资料予以判定是否具备预审资格；
        </li>
        <li className={styles.ulItem}>
          5. 本调查表填写完成后，加盖公章并装订成册，成为长虹公司现场审核的重要材料之一。
        </li>
      </ul>
      <div className={styles.commonTitle}>拟推荐产品</div>
      <ExtTable
        {...tableProps}
        showSearch={false}
        // dataSource={dataSource}
        columns={columns}
        bordered
      />
    </div>
  )
}

export default Explain;