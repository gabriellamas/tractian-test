import { Col, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { loadingContext } from "../../context/LoadingContext";

interface User {
  companyId: number;
  email: string;
  id: number;
  name: string;
  unitId: number;
}

interface Company {
  id: number;
  name: string;
}

const UsersPage = () => {
  const { messageApi } = useContext(loadingContext);
  const [dataTable, setDataTable] = useState<DataType[]>([]);

  interface DataType {
    key: string;
    name: string;
    email: string;
    company: Company;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
  ];

  const companiesInfoFromUsers = useCallback(async (data: User[]) => {
    try {
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
        throw new Error(error.message);
      } else {
        throw new Error(`${error}`);
      }
    }
  }, []);

  const fetchInfos = useCallback(async () => {
    try {
      messageApi.open({
        type: "loading",
        content: "Trazendo dados...",
        duration: 0,
      });
      const usersInfo = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/users"
      );
      const companiesInfo = await companiesInfoFromUsers(usersInfo.data);

      const dataTable = usersInfo.data.map((user: User) => ({
        key: user.name,
        name: user.name,
        email: user.email,
        company: companiesInfo.find((company) => company.id === user.companyId)
          .name,
      }));

      setDataTable(dataTable);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        await messageApi.open({
          type: "error",
          content: `Error: ${error.message}. Tente novamente mais tarde..`,
        });
      } else {
        await messageApi.open({
          type: "error",
          content: `Error: ${error}. Tente novamente mais tarde..`,
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
        <h1>Usuários</h1>
      </Col>
      <Table
        dataSource={dataTable}
        columns={columns}
        style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px" }}
      />
    </>
  );
};
export default UsersPage;
