import UserSelect from './src/UserSelect'
import DeptSelect from './src/DeptSelect'
import PopData from './src/PopData'
import PostSelect from './src/PostSelect'
import RoleSelect from './src/RoleSelect'
import AreaSelect from './src/AreaSelect'
import FormTable from './src/FormTable'
import FormDisplay from './src/FormDisplay'
import RowExpression from './src/RowExpression'
import Download from './src/Download'
import IdShow from './src/IdShow'

export default function install(Vue) {
    Vue.component(FormTable.name, FormTable)
    Vue.component(UserSelect.name, UserSelect)
    Vue.component(DeptSelect.name, DeptSelect)
    Vue.component(RoleSelect.name, RoleSelect)
    Vue.component(PostSelect.name, PostSelect)
    Vue.component(PopData.name, PopData)
    Vue.component(AreaSelect.name, AreaSelect)
    Vue.component(FormDisplay.name, FormDisplay)
    Vue.component(RowExpression.name, RowExpression)
    Vue.component(Download.name, Download)
    Vue.component(IdShow.name, IdShow)
}