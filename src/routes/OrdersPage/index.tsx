import axios from "axios";
import { Col, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useContext, useEffect, useState } from "react";
import { loadingContext } from "../../context/LoadingContext";

interface Order {
  assetId: number;
  assignedUserIds: [number, number, number];
  checklist: [
    {
      completed: true;
      task: string;
    },
    {
      completed: string;
      task: string;
    },
    {
      completed: boolean;
      task: string;
    }
  ];
  description: string;
  id: number;
  priority: "high" | "Low";
  status: "completed" | "pending";
  title: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { messageApi } = useContext(loadingContext);

  interface DataType {
    priority: string;
    title: string;
    description: string;
    status: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Prioridade",
      dataIndex: "priority",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Título",
      dataIndex: "title",
    },
    {
      title: "Descrição",
      dataIndex: "description",
    },
  ];

  const dataTable: DataType[] = orders.map((order) => ({
    priority: order.priority,
    title: order.title,
    description: order.description,
    status: order.status,
  }));

  const fetchInfos = useCallback(async () => {
    try {
      messageApi.open({
        type: "loading",
        content: "Bringing data..",
        duration: 0,
      });
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/workorders"
      );
      setOrders(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error(`${error}`);
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
        <h1>Ordens de Serviço</h1>
      </Col>
      <Table
        dataSource={dataTable}
        columns={columns}
        style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px" }}
      />
    </>
  );
};
export default OrdersPage;
