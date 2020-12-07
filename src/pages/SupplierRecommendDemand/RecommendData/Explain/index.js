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
    },
    {
      title: '计量单位',
      dataIndex: 'unitName',
      width: 100
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
  /**
   * 1.本调查表为供应商体系的整体概括，直接影响我司对贵司的评价，请务必准确全面填写；
2.填写此调查表时，若需添加附件，表格格式、项目、内容等必须与调查表中的完全一致；
3.认证证书包括ISO9001、ISO14001、QC080000、ISO45001、ISO27001、UL、VDE、EMC、CCC、CE等所有认证；
4.所有项目按模块进行填写，每个模块的内容填写完成后，就可以保存，所有模块填写后才能提交；
   */
  return (
    <div className={styles.wrapper}>
      <div className={styles.commonTitle}>填表说明</div>
      <ul className={styles.ul}>
        <li className={styles.ulItem}>
          本调查表为双方合作前对供应商整体状况的调查，请务必认真、如实填写。填写之前，请仔细研阅填表说明：
        </li>
        <li className={styles.ulItem}>
          1.本调查表为供应商体系的整体概括，直接影响我司对贵司的评价，请务必准确全面填写；
        </li>
        <li className={styles.ulItem}>
          2.填写此调查表时，若需添加附件，表格格式、项目、内容等必须与调查表中的完全一致；
        </li>
        <li className={styles.ulItem}>
          3.认证证书包括ISO9001、ISO14001、QC080000、ISO45001、ISO27001、UL、VDE、EMC、CCC、CE等所有认证；
        </li>
        <li className={styles.ulItem}>
          4. 所有项目按模块进行填写，每个模块的内容填写完成后，就可以保存，所有模块填写后才能提交；
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