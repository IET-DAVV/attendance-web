import React from "react";
import { Document, View, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "571px",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    margin: "15px",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "57px",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 7,
  },
});

interface ITablePDF {
  headers: Array<string>;
  data: Array<Array<string>>;
  classInfo: any;
}

const TablePDF: React.FC<ITablePDF> = ({ headers, data }) => {
  return (
    <Document>
      <Page>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {headers.map((header: string, index) => (
              <View key={index} style={styles.tableCol}>
                <Text style={styles.tableCell}>{header}</Text>
              </View>
            ))}
          </View>
          {data.map((rowData: string[], index: number) => (
            <View key={index} style={styles.tableRow}>
              {rowData.map((cell: string, index) => (
                <View key={index} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TablePDF;
