export interface AntTableConfig {
  loading?: boolean;
  rowSelection?: RowSelectionConfig;
  showIndex?: boolean;
  pagination?: boolean | PaginationConfig;
  scroll?: { x?: number | string; y?: number | string };
  bordered?: boolean;
  size?: 'small' | 'middle' | 'large';
  columns: AntTableColumn[];
  emptyText?: string;
  rowKey?: string | ((record: any) => string);
}

export interface AntTableColumn {
  title: string;
  dataIndex: string;
  key?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a: any, b: any) => number);
  filters?: FilterItem[];
  type?: 'text' | 'input' | 'select' | 'date' | 'link' | 'operation' | 'custom' | 'switch';
  render?: (value: any, record: any, index: number) => any;
  children?: AntTableColumn[];
  format?: FormatConfig;
  operation?: OperationConfig[];
  slotName?: string;
  options?: SelectOption[];
  disabled?: boolean | ((record: any) => boolean);
  ellipsis?: boolean;
  tooltip?: boolean;
  editable?: boolean;
  required?: boolean;
  placeholder?: string;
}

export interface FilterItem {
  text: string;
  value: string | number;
}

export interface RowSelectionConfig {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: any[];
  onChange?: (selectedRowKeys: any[], selectedRows: any[]) => void;
  getCheckboxProps?: (record: any) => any;
  fixed?: boolean;
  columnWidth?: number | string;
}

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  pageSizeOptions?: string[];
  size?: 'default' | 'small';
  simple?: boolean;
  position?: 'top' | 'bottom' | 'both';
}

export interface TableData {
  id: number | string;
  [key: string]: any;
}

export interface TableResponse {
  data: TableData[];
  total: number;
  current: number;
  pageSize: number;
}

export interface FormatConfig {
  type: 'dict' | 'date' | 'currency' | 'custom';
  dictKey?: string;
  dateFormat?: string;
  formatter?: (value: any, record: any) => any;
}

export interface OperationConfig {
  title: string;
  permission?: string;
  visible?: (record: any) => boolean;
  disabled?: (record: any) => boolean;
  onClick: (record: any) => void;
  type?: 'primary' | 'danger' | 'default' | 'link';
  icon?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}