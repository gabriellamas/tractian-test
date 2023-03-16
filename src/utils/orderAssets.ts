import { Assets } from "../routes/AssetsPage";

export const orderAssets = (array: Assets[]) => {
  array.sort((assetA, assetB) => {
    if (assetA.status === "inAlert") {
      return -1;
    } else if (assetA.status === "inOperation") {
      return 1;
    } else if (assetB.status === "inAlert") {
      return 1;
    } else if (assetB.status === "inOperation") {
      return -1;
    } else {
      return 0;
    }
  });

  return array;
};
