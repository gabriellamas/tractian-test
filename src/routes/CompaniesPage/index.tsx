import { Col, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoadingSVG } from "../../components/LoadingSVG";
import { loadingContext } from "../../context/LoadingContext";

interface Companie {
  companyId: number;
  id: number;
  name: string;
}

const CompaniesPage = () => {
  const { loading, setLoading } = useContext(loadingContext);
  const [companies, setCompanies] = useState<Companie[]>([]);

  interface DataType {
    name: string;
    id: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "ID",
      dataIndex: "id",
    },
  ];

  const dataTable: DataType[] = companies.map((companie) => ({
    name: companie.name,
    id: companie.id,
  }));

  const fetchInfos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/companies"
      );
      setCompanies(data);
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
        <h1>Empresa</h1>
      </Col>
      <Table
        dataSource={dataTable}
        columns={columns}
        style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px" }}
      />
    </>
  );
};
export default CompaniesPage;
