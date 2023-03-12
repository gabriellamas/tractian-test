import {
  Col,
  Row,
  Empty,
  Button,
  Modal,
  Timeline,
  Layout,
  Menu,
  Breadcrumb,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingSVG } from "./components/LoadingSVG";
import { AssetImage } from "./components/AssetImage";
import { dateFormat } from "./utils/dateFormat";
import TractianLogo from "./assets/tractian-logo.svg";

import axios from "axios";
import styles from "./App.module.css";

import {
  fetchAssignedUserIds,
  Responsibles,
} from "./utils/fetchAssignedUserIds";
import { Content, Footer, Header } from "antd/es/layout/layout";

interface HealthStatusTimeStamp {
  status: string;
  timestamp: string;
}

interface Assets {
  assignedUserIds: number[];
  companyId: number;
  healthHistory: HealthStatusTimeStamp[];
  healthscore: number;
  id: number;
  image: string;
  metrics: {
    lastUptimeAt: string;
    totalCollectsUptime: number;
    totalUptime: number;
  };
  model: string;
  name: string;
  sensors: string[];
  specifications: {
    maxTemp: number;
    power: number;
    rpm: number | null;
  };
  status: string;
  unitId: number;
}
interface Status {
  [key: string]: string;
}

interface itemsHistory {
  children: JSX.Element;
}

const Status: Status = {
  inAlert: "Em Alerta",
  inOperation: "Em Operação",
  inDowntime: "Em Parada",
  unplannedStop: "Parada inesperada",
};

const menuOptions = [
  "Ativos",
  "Usuários",
  "Unidades",
  "Empresas",
  "Ordens de Serviço",
];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Assets[]>([]);

  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [historySelected, setHistorySelected] = useState<itemsHistory[]>([]);

  const [isModalOpenResponsible, setIsModalOpenResponsible] = useState(false);
  const [responsiblesSelected, setResponsiblesSelected] = useState<
    Responsibles[]
  >([]);

  const handleShowModalHistory = (index: number) => {
    const itemsHistory = assets[index].healthHistory.map((health) => ({
      children: (
        <>
          <p>{Status[health.status]}</p>
          <p>{dateFormat(health.timestamp)}</p>
        </>
      ),
    }));

    setHistorySelected(itemsHistory);
    setIsModalOpenHistory(true);
  };

  const handleShowModalResposibles = async (index: number) => {
    setLoading(true);
    const responsibles = await fetchAssignedUserIds(
      assets[index].assignedUserIds
    );
    setResponsiblesSelected(responsibles);
    setIsModalOpenResponsible(true);
    setLoading(false);
  };

  const handleOkorCancel = (name: string) => {
    if (name === "history") {
      setIsModalOpenHistory(false);
    }
    if (name === "responsible") {
      setIsModalOpenResponsible(false);
    }
  };

  const fetchInfos = async () => {
    try {
      const { data } = await axios.get(
        "https://my-json-server.typicode.com/tractian/fake-api/assets"
      );
      setAssets(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error(`${error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    fetchInfos();
  }, []);

  return (
    <>
      <Layout>
        <Header
          style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}
        >
          <div
            style={{
              float: "left",
              width: 120,
              height: 31,
              margin: "16px 24px 16px 0",
              background: `url(${TractianLogo}) no-repeat center center`,
            }}
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={menuOptions.map((title, index) => ({
              key: String(index + 1),
              label: `${title}`,
            }))}
          />
        </Header>
        <Content className="site-layout" style={{ padding: "0 50px" }}>
          <Breadcrumb items={[{ title: "Ativos" }]} />
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: colorBgContainer,
            }}
          >
            {loading && <LoadingSVG />}
            <Col>
              <h1>Ativos</h1>
            </Col>
            {assets ? (
              assets.map((asset, index) => (
                <Col
                  style={{ padding: "16px 24px" }}
                  key={asset.id}
                  className={styles.ColAssetInfo}
                  span={24}
                >
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <AssetImage image={asset.image} />

                    <div className={styles.BodyInfoAsset}>
                      <div>
                        <strong>Status</strong>
                        <p>{Status[asset.status]}</p>
                        <strong>Performance:</strong>
                        <p>{asset.healthscore}%</p>
                      </div>
                      <div>
                        <strong>Métricas</strong>
                        <p>
                          Data da Ultima Coleta:{" "}
                          {dateFormat(asset.metrics.lastUptimeAt)}
                        </p>
                        <p>
                          Total de Coletas: {asset.metrics.totalCollectsUptime}
                        </p>
                        <p>
                          Total de Horas de Coletas:{" "}
                          {asset.metrics.totalUptime.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <strong>Especificações</strong>
                        <p>
                          Temperatura máxima: {asset.specifications.maxTemp} ºC
                        </p>
                        <p>Power: {asset.specifications.power} kWh</p>
                        <p>
                          RPM:{" "}
                          {asset.specifications.rpm
                            ? asset.specifications.rpm
                            : "Sem informação"}
                        </p>
                      </div>
                      <div>
                        <strong>Informações</strong>
                        <p>Modelo: {asset.model}</p>
                        <p>Name: {asset.name}</p>
                        <p>Sensores: {asset.sensors.map((sensor) => sensor)}</p>
                      </div>
                    </div>
                  </div>
                  <footer
                    style={{
                      display: "flex",
                      gap: "24px",
                      justifyContent: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      type="default"
                      onClick={() => handleShowModalHistory(index)}
                    >
                      Histórico funcionamento
                    </Button>

                    <Button
                      type="default"
                      onClick={() => handleShowModalResposibles(index)}
                    >
                      Visualizar responsáveis
                    </Button>
                  </footer>
                </Col>
              ))
            ) : (
              <Empty />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>

      <Modal
        title="Historico de funcionamento"
        open={isModalOpenHistory}
        onOk={() => handleOkorCancel("history")}
        onCancel={() => handleOkorCancel("history")}
      >
        <div style={{ marginTop: "32px" }}>
          <Timeline items={historySelected} />
        </div>
      </Modal>

      <Modal
        title="Responsáveis"
        open={isModalOpenResponsible}
        onOk={() => handleOkorCancel("responsible")}
        onCancel={() => handleOkorCancel("responsible")}
      >
        <div style={{ marginTop: "32px" }}>
          {responsiblesSelected.map((responsible) => (
            <div key={responsible.name} style={{ marginBottom: "32px" }}>
              <p>{responsible.name}</p> <p>{responsible.email}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
export default App;
