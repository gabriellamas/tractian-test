export interface AssetsForChart {
  name: string;
  y: number;
  drilldown: string;
}

export interface ChartData {
  chart: {
    type: string;
  };
  title: {
    align: string;
    text: string;
  };
  accessibility: {
    announceNewData: {
      enabled: boolean;
    };
  };
  xAxis: {
    type: string;
  };
  yAxis: {
    title: {
      text: string;
    };
  };
  legend: {
    enabled: boolean;
  };
  plotOptions: {
    series: {
      borderWidth: number;
      dataLabels: {
        enabled: boolean;
        format: string;
      };
    };
  };

  tooltip: {
    headerFormat: string;
    pointFormat: string;
  };

  series: [
    {
      name: string;
      colorByPoint: boolean;
      data: AssetsForChart[];
    }
  ];
}

export const optionsChart = (assets: AssetsForChart[]): ChartData => ({
  chart: {
    type: "column",
  },
  title: {
    align: "left",
    text: "Healthscore dos ativos",
  },
  accessibility: {
    announceNewData: {
      enabled: true,
    },
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    title: {
      text: "Porcentagem média",
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: "{point.y:.1f}%",
      },
    },
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
  },

  series: [
    {
      name: "Ativos",
      colorByPoint: true,
      data: assets,
    },
  ],
});
