import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';

export default function TableExample() {
  return (
    <DataTable style={styles.container}>

      <DataTable.Header style={styles.header}>
        <DataTable.Title>Name</DataTable.Title>
        <DataTable.Title>Food</DataTable.Title>
        <DataTable.Title numeric>Age</DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        <DataTable.Cell>Alisha</DataTable.Cell>
        <DataTable.Cell>Pizza</DataTable.Cell>
        <DataTable.Cell numeric>21</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>Ali</DataTable.Cell>
        <DataTable.Cell>Biryani</DataTable.Cell>
        <DataTable.Cell numeric>22</DataTable.Cell>
      </DataTable.Row>

    </DataTable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    backgroundColor: '#c2328b',
  },
});