import { Layout, Menu, Breadcrumb, theme, Col } from "antd";

import TractianLogo from "../../assets/tractian-logo.svg";

import { Content, Footer, Header } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useCallback, useContext, useEffect, useState } from "react";
import { fetchAssets } from "../../utils/fetchAssets";
import { loadingContext } from "../../context/LoadingContext";
import { Assets } from "../AssetsPage";
import { ChartData, optionsChart } from "./optionsChart";
import { LoadingSVG } from "../../components/LoadingSVG";

const menuOptions = [
  { name: "Gráficos", route: "/" },
  { name: "Ordens de serviço", route: "/ordens" },
  { name: "Ativos", route: "/ativos" },
  { name: "Usuários", route: "/usuarios" },
  { name: "Unidades", route: "/unidades" },
  { name: "Empresa", route: "/empresa" },
];

const Home = () => {
  const { loading, setLoading } = useContext(loadingContext);
  const [dataForChart, setDataForChart] = useState<ChartData>();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();

  const navigate = useNavigate();

  const handleFetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data: Assets[] = await fetchAssets();

      const dataForChart = data.map((asset) => ({
        name: asset.name,
        y: asset.healthscore,
        drilldown: asset.name,
      }));

      const dataHighchartFormated = optionsChart(dataForChart);
      setDataForChart(dataHighchartFormated);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFetchAssets();
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
            defaultSelectedKeys={[
              `${
                menuOptions.findIndex(
                  (option) => option.route === location.pathname
                ) + 1
              }`,
            ]}
            items={menuOptions.map((option, index) => ({
              key: String(index + 1),
              label: `${option.name}`,
              onClick: () => navigate(`${option.route}`),
            }))}
          />
        </Header>
        <Content className="site-layout" style={{ padding: "0 50px" }}>
          <Breadcrumb
            style={{ margin: "16px 0px" }}
            items={[
              {
                title: `${
                  menuOptions[
                    menuOptions.findIndex(
                      (option) => option.route === location.pathname
                    )
                  ].name
                }`,
              },
            ]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: colorBgContainer,
            }}
          >
            {loading && <LoadingSVG />}
            {location.pathname === "/" ? (
              <>
                <Col style={{ marginBottom: "24px" }}>
                  <h1>Gráficos</h1>
                </Col>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={dataForChart}
                />
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Tractian test Software Engineer ©2023 Created by Gabriel Lamas
        </Footer>
      </Layout>
    </>
  );
};
export default Home;
