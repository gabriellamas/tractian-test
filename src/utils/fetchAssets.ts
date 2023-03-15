import axios from "axios";

export const fetchAssets = async () => {
  const assetsData = window.localStorage.getItem("@tractian:Assets");
  if (assetsData) return JSON.parse(assetsData);
  try {
    const { data } = await axios.get(
      "https://my-json-server.typicode.com/tractian/fake-api/assets"
    );

    window.localStorage.setItem("@tractian:Assets", JSON.stringify(data));
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.message;
    } else {
      throw error;
    }
  }
};
