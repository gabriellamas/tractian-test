import { Col, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoadingSVG } from "../../components/LoadingSVG";
import { loadingContext } from "../../context/LoadingContext";

interface Unit {
  companyId: number;
  id: number;
  name: string;
}

const UnitsPage = () => {
  const { loading, setLoading } = useContext(loadingContext);
  const [units, setUnits] = useState<Unit[]>([]);

  interface DataType {
    name: string;
    company: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
  ];

  const dataTable: DataType[] = units.map((unit) => ({
    name: unit.name,
    company: unit.companyId,
  }));

  const fetchInfos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/units"
      );
      setUnits(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error(`${error}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfos();
  }, []);

  if (loading) return <LoadingSVG />;
  return (
    <>
      <Col style={{ marginBottom: "24px" }}>
        <h1>Unidades</h1>
      </Col>
      <Table
        dataSource={dataTable}
        columns={columns}
        style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px" }}
      />
    </>
  );
};
export default UnitsPage;
