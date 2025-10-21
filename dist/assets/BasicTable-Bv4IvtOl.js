import{d as F,r as z,p as g,b as j,o as R,c as f,u as y,T as N,w as m,E as A,q as P,s as Y,v as _,_ as L}from"./index-18XKJJX4.js";const K={class:"ant-basic-table"},M=F({__name:"BasicTable",props:{config:{},dataSource:{default:()=>[]},pagination:{},emptyText:{default:"暂无数据"}},emits:["change","rowClick","selectionChange","cellEvent"],setup(c,{expose:w,emit:p}){const I={name:"AntTableColumn",template:`
    <div class="ant-table-column">
      <!-- 输入框列 -->
      <a-input
        v-if="column.type === 'input'"
        :value="getCellValue()"
        :disabled="isDisabled"
        @change="handleInputChange"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
      />

      <!-- 下拉选择列 -->
      <a-select
        v-else-if="column.type === 'select'"
        :value="getCellValue()"
        :options="column.options"
        :disabled="isDisabled"
        @change="handleSelectChange"
        @focus="handleSelectFocus"
        style="width: 100%"
      />

      <!-- 日期选择列 -->
      <a-date-picker
        v-else-if="column.type === 'date'"
        :value="getCellValue() ? dayjs(getCellValue()) : null"
        :disabled="isDisabled"
        @change="handleDateChange"
        style="width: 100%"
      />

      <!-- 链接列 -->
      <a-link
        v-else-if="column.type === 'link'"
        :disabled="isDisabled"
        @click="handleLinkClick"
      >
        {{ getCellValue() }}
      </a-link>

      <!-- Switch开关列 -->
      <a-switch
        v-else-if="column.type === 'switch'"
        :checked="getCellValue()"
        :disabled="isDisabled"
        @change="handleSwitchChange"
      />

      <!-- 操作列 -->
      <div v-else-if="column.type === 'operation'" class="operation-buttons">
        <template v-for="(op, idx) in column.operation" :key="idx">
          <a-button
            v-if="op.visible?.(record) !== false"
            :type="op.type || 'default'"
            :disabled="op.disabled?.(record)"
            size="small"
            @click="() => op.onClick(record)"
            class="operation-btn"
          >
            {{ op.title }}
          </a-button>
        </template>
      </div>

      <!-- 自定义插槽 -->
      <slot
        v-else-if="column.slotName"
        :value="getCellValue()"
        :record="record"
        :index="index"
      />

      <!-- 自定义渲染 -->
      <template v-else-if="column.render">
        {{ column.render(getCellValue(), record, index) }}
      </template>

      <!-- 默认文本渲染 -->
      <span v-else>{{ formatValue(getCellValue(), record) }}</span>
    </div>
  `,props:{column:Object,record:Object,index:Number},emits:["cellEvent"],setup(e,{emit:n}){const l=()=>e.record[e.column.dataIndex],a=g(()=>typeof e.column.disabled=="function"?e.column.disabled(e.record):e.column.disabled??!1);return{getCellValue:l,isDisabled:a,formatValue:(t,d)=>{if(e.column.format){const{type:r,formatter:x}=e.column.format;if(r==="custom"&&x)return x(t,d)}return t},handleInputChange:t=>{var r;const d=((r=t.target)==null?void 0:r.value)??t;n("cellEvent","inputChange",d,e.record,e.column.dataIndex)},handleInputBlur:t=>{n("cellEvent","inputBlur",t.target.value,e.record,e.column.dataIndex)},handleInputFocus:t=>{n("cellEvent","inputFocus",t.target.value,e.record,e.column.dataIndex)},handleSelectChange:t=>{n("cellEvent","selectChange",t,e.record,e.column.dataIndex)},handleSelectFocus:()=>{n("cellEvent","selectFocus",l(),e.record,e.column.dataIndex)},handleDateChange:t=>{const d=t?_(t).format("YYYY-MM-DD"):null;n("cellEvent","dateChange",d,e.record,e.column.dataIndex)},handleLinkClick:()=>{n("cellEvent","linkClick",l(),e.record,e.column.dataIndex)},handleSwitchChange:t=>{n("cellEvent","switchChange",t,e.record,e.column.dataIndex)}}}},i=c,s=p,u=z(),C=g(()=>{if(i.config.pagination===!1)return!1;const e={current:1,pageSize:10,total:0,showSizeChanger:!0,showQuickJumper:!0,showTotal:o=>`共 ${o} 条`},n=typeof i.config.pagination=="object"?{...e,...i.config.pagination}:e,{position:l,...a}=n;return a}),S=g(()=>{if(i.config.rowSelection)return{selectedRowKeys:[],onChange:(e,n)=>{s("selectionChange",e,n)},...i.config.rowSelection}}),E=g(()=>{const e=[...i.config.columns];return i.config.showIndex&&e.unshift({title:"序号",dataIndex:"index",key:"index",width:60,align:"center",render:(n,l,a)=>{const o=C.value;return o&&typeof o=="object"?(o.current-1)*o.pageSize+a+1:a+1}}),e.map(n=>({...n,title:n.title||""}))}),V=(e,n,l,a)=>{s("change",e,n,l,a)},D=(e,n)=>{s("rowClick",e,n)},T=(e,n,l,a)=>{s("cellEvent",e,n,l,a)},h=e=>e.slotName,B=e=>({...e,title:e.title||"",dataIndex:e.dataIndex||e.key});return w({getTableRef:()=>u.value,clearSelection:()=>{var e,n;u.value&&((n=(e=u.value).clearSelection)==null||n.call(e))}}),(e,n)=>(R(),j("div",K,[f(y(N),{ref_key:"tableRef",ref:u,columns:E.value,"data-source":c.dataSource,pagination:C.value,"row-selection":S.value,loading:c.config.loading,bordered:c.config.bordered??!0,size:c.config.size??"middle",scroll:c.config.scroll,onChange:V,onRowClick:D,"row-key":c.config.rowKey||"id"},{bodyCell:m(({column:l,record:a,index:o})=>[f(I,{column:B(l),record:a,index:o,onCellEvent:T},P({_:2},[h(l)?{name:h(l),fn:m(({value:v,record:b,index:k})=>[Y(e.$slots,h(l),{value:v,record:b,index:k},void 0,!0)]),key:"0"}:void 0]),1032,["column","record","index"])]),emptyText:m(()=>[f(y(A),{description:c.emptyText},null,8,["description"])]),_:3},8,["columns","data-source","pagination","row-selection","loading","bordered","size","scroll","row-key"])]))}}),H=L(M,[["__scopeId","data-v-cc240233"]]);export{H as A};
