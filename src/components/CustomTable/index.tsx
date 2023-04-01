import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

interface CustomColumnProps<T> extends ColumnType<T> {
  searchable?: boolean;
}

interface Props<T> extends TableProps<T> {
  dataSource: T[];
  columns: CustomColumnProps<T>[];
}

type DataIndex<T> = keyof T & string;

type DataRecord<T> = {
  [P in keyof T]: string | number | boolean | null | undefined;
};

const CustomTable = <T extends DataRecord<T>>({
  dataSource,
  columns,
  ...restProps
}: Props<T>) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const cols: ColumnType<T>[] = columns as ColumnType<T>[];

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: DataIndex<T>
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(String(dataIndex));
  };

  const handleReset = (clearFilters: (() => void) | undefined) => {
    clearFilters && clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex<T>): ColumnType<T> => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${String(dataIndex)}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex as string);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record: any) =>
        record[dataIndex as string]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  };

  const columnsWithSearch: ColumnType<T>[] = cols.map((col) => ({
    ...col,
    // @ts-ignore
    ...(col.searchable && col.dataIndex
      ? getColumnSearchProps(col.dataIndex as DataIndex<T>)
      : {}),
  }));

  return (
    <Table columns={columnsWithSearch} dataSource={dataSource} {...restProps} />
  );
};

export default CustomTable;
