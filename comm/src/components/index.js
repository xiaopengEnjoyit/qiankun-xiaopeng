/*
 * @Description:
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-12-02 14:42:45
 * @LastEditors: zhangpeng
 * @LastEditTime: 2022-11-14 15:18:16
 */
// 公共组件导出总线
// export { default as ansoTree } from './anso-tree'
export const ansoTree = require('./anso-tree').default
export { default as ansoDatePicker } from './anso-date-picker'
export { default as ansoSidebar } from './anso-sidebar'
export { default as ansoForm } from './anso-form'
export { default as tableForm } from './table-form'
export { default as ansoFormGroup } from './anso-form-group'
export { default as tableTools } from './table-tools'
export { default as tableHead } from './table-head'
export { default as ansoTable } from './anso-table'
export { default as tablePage } from './table-page'
export { default as ansoModal } from './anso-modal'
export { default as contTitle } from './cont-title'
export { default as ansoTransfer } from './anso-transfer'
export { default as ansoTreeSelect } from './anso-tree-select'
export { default as pageInfo } from './page-info'
export { default as ansoJsonEditor } from './anso-json-editor'
export { default as leftTitleRightBtn } from './left-title-right-btn'
export { default as ansoButton } from './anso-button'
export { default as ansoSelect } from './anso-select'
export { default as ansoDescriptions } from './anso-descriptions'
export { default as ansoSubLayout } from './anso-sub-layout'
export { default as ansoMixinForm } from './anso-mixin-form'
export { default as ansoTitle } from './anso-title'
export { default as ansoTooltips } from './anso-tooltips'
export { default as ansoDescriptionsForm } from './anso-descriptions-form'
export { default as ansoTableEdit } from './anso-table-edit'
export { default as threeZoomBox } from './three-zoom-box'
export { default as ansoDrawer } from './anso-drawer'
export { default as ansoTitleForm } from './anso-title-form'

const exportComponents = {}
const requireComponent = require.context('./anso-lowCode-components/systemComponents', true, /index\.vue$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  // 获取组件名，这里我们去掉头和尾，利用正则匹配
  // 示例： 文件 ./Skeleton/index.vue --> Skeleton
  // const tempName = fileName.match(/\/(\w+)\//i)[1]
  const tempName = fileName.split('/')[2]

  exportComponents[tempName] = componentConfig.default || componentConfig
})
export default { ...exportComponents }
/*
 *                        .::::.
 *                      .::::::::.
 *                     :::::::::::
 *                  ..:::::::::::'
 *               '::::::::::::'
 *                 .::::::::::
 *            '::::::::::::::..
 *                 ..::::::::::::.
 *               ``::::::::::::::::
 *                ::::``:::::::::'        .:::.
 *               ::::'   ':::::'       .::::::::.
 *             .::::'      ::::     .:::::::'::::.
 *            .:::'       :::::  .:::::::::' ':::::.
 *           .::'        :::::.:::::::::'      ':::::.
 *          .::'         ::::::::::::::'         ``::::.
 *      ...:::           ::::::::::::'              ``::.
 *     ````':.          ':::::::::'                  ::::..
 *                        '.:::::'                    ':'````..
 */
