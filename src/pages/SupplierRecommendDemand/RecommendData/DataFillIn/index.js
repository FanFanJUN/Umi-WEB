import styles from './index.less';
import { Tabs, Checkbox } from 'antd';
const { TabPane } = Tabs;

function DataFillIn({
  /** 
   * @param type
   * create 填报新表单
   * editor 编辑已有表单
   * @param id
   * editor状态时表单id
  */
  type = 'create',
  id = null
}) {
  const baseConditionTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>基本情况</div>
      <Checkbox checked={false}/>
    </div>
  )
  const sellConditionTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>销售情况</div>
      <Checkbox checked={false}/>
    </div>
  )
  const researchAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>研发能力</div>
      <Checkbox checked={false}/>
    </div>
  )
  const qualityAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>质量能力</div>
      <Checkbox checked={false}/>
    </div>
  )
  const managerAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>供应链</div>
        <div>管理能力</div>
      </div>
      <Checkbox checked={false}/>
    </div>
  )
  const manufactureAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>制造能力</div>
      <Checkbox checked={false} />
    </div>
  )
  const hdssControllTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>产品有害</div>
        <div>物质管控</div>
      </div>
      <Checkbox checked={true} />
    </div>
  )
  const DWCTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>合作意愿</div>
      <Checkbox checked={true} />
    </div>
  )
  const CSRTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>企业</div>
        <div>社会责任</div>
      </div>
      <Checkbox checked={false} />
    </div>
  )
  const EPETab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>企业生产</div>
        <div>环境情况</div>
      </div>
      <Checkbox checked={true} />
    </div>
  )
  const otherTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>其他</div>
        <div>附加资料</div>
      </div>
      <Checkbox checked={false} />
    </div>
  )
  const quotationAndGPCATab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>报价单及</div>
        <div>成分分析表</div>
      </div>
      <Checkbox checked={true} />
    </div>
  )
  return (
    <div>
      <Tabs tabPosition='left'>
        {/* 基本情况 */}
        <TabPane key='baseCondition' tab={baseConditionTab}>

        </TabPane>

        {/* 销售情况 */}
        <TabPane key='sellCondition' tab={sellConditionTab}>

        </TabPane>

        {/* 研发能力 */}
        <TabPane key='researchAbility' tab={researchAbilityTab}>

        </TabPane>

        {/* 质量能力 */}
        <TabPane key='qualityAbility' tab={qualityAbilityTab}>

        </TabPane>

        {/* 供应链管理能力 */}
        <TabPane key='managerAbility' tab={managerAbilityTab}>

        </TabPane>

        {/* 制造能力 */}
        <TabPane key='manufactureAbility' tab={manufactureAbilityTab}>

        </TabPane>

        {/* 产品有害物质管控 */}
        <TabPane key='hdssControll' tab={hdssControllTab}>

        </TabPane>

        {/* 合作意愿 */}
        <TabPane key='DWC' tab={DWCTab}>

        </TabPane>

        {/* 企业社会责任 */}
        <TabPane key='CSR' tab={CSRTab}>

        </TabPane>

        {/* 企业生产环境情况 */}
        <TabPane key='EPE' tab={EPETab}>

        </TabPane>

        {/* 其他附加资料 */}
        <TabPane key='other' tab={otherTab}>

        </TabPane>

        {/* 报价单及成分分析表 */}
        <TabPane key='quotationAndGPCA' tab={quotationAndGPCATab}>
          
        </TabPane>
      </Tabs>
    </div>
  )
}
export default DataFillIn;