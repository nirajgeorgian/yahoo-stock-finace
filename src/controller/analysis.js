import unirest from "unirest";
import { getAsync, getTimeLeft, setAsync } from "../cache";
import config from "../config";

const createAnalysisApi = (symbol) => {
  const api = unirest("GET", config.analysisUri);

  api.query({
    symbol,
    region: "US",
  });

  api.headers({
    "x-rapidapi-key": config.rapidApiKey,
    "x-rapidapi-host": config.rapidApiHost,
    useQueryString: true,
  });

  return api;
};

const updateAnalysisApi = (key, symbol) => {
  const api = createAnalysisApi(symbol);

  api.end((response) => {
    if (response.error) {
      console.error("error");
    }

    const values = response.body.items.result;
    setAsync(key, 60 * 5, JSON.stringify(values));
  });
};

export const getAnalysis = async (req, res) => {
  const { symbol = "AMRN" } = req.query;
  const key = `finance::analysis::${symbol}`;

  const values = await getAsync(key);
  if (values) {
    const timeLeft = await getTimeLeft(key);
    if (timeLeft < 30) {
      updateAnalysisApi(key, symbol);
    }

    return res.send({ data: JSON.parse(values) });
  }

  const api = createAnalysisApi(symbol);
  api.end((response) => {
    if (response.error) {
      next(response.error);
    }

    const values = response.body;
    setAsync(key, 60 * 5, JSON.stringify(values));

    return res.send({ data: values });
  });
};
