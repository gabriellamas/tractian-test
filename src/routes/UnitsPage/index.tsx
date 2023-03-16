import { Col, message, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { loadingContext } from "../../context/LoadingContext";

interface Unit {
  companyId: number;
  id: number;
  name: string;
}

const UnitsPage = () => {
  const { messageApi } = useContext(loadingContext);
  const [dataTable, setDataTable] = useState<DataType[]>([]);
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

  const companiesInfoFromUnits = useCallback(async (data: Unit[]) => {
    try {
      messageApi.open({
        type: "loading",
        content: "Bringing data..",
        duration: 0,
      });
      const companiesInfo = await axios.all(
        data.map(({ companyId }) =>
          axios.get(
            `https://my-json-server.typicode.com/tractian/fake-api/companies/${companyId}`
          )
        )
      );
      return companiesInfo.map((response) => response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.open({
          type: "error",
          content: `Error: ${error.message}. Try again later.`,
        });
      } else {
        messageApi.open({
          type: "error",
          content: `Error: ${error}. Try again later.`,
        });
      }
    } finally {
      messageApi.destroy();
    }
  }, []);

  const fetchInfos = useCallback(async () => {
    try {
      messageApi.open({
        type: "loading",
        content: "Bringing data..",
        duration: 0,
      });
      const unitsInfo = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/units"
      );
      const companiesInfo = await companiesInfoFromUnits(unitsInfo.data);

      const dataTable = unitsInfo.data.map((unit: Unit) => ({
        key: unit.name,
        name: unit.name,
        company: companiesInfo?.find((company) => company.id === unit.companyId)
          .name,
      }));

      setDataTable(dataTable);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        await messageApi.open({
          type: "error",
          content: `Error: ${error.message}. Try again later.`,
        });
      } else {
        await messageApi.open({
          type: "error",
          content: `Error: ${error}. Try again later.`,
        });
      }
    } finally {
      messageApi.destroy();
    }
  }, []);

  useEffect(() => {
    fetchInfos();
  }, []);

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
