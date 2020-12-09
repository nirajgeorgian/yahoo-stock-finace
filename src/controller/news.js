import unirest from "unirest";
import config from "../config";
import { getAsync, getTimeLeft, setAsync } from "../cache";

const createNewsApi = (category) => {
  const api = unirest("GET", config.newsUri);

  api.query({
    category,
    region: "US",
  });

  api.headers({
    "x-rapidapi-key": config.rapidApiKey,
    "x-rapidapi-host": config.rapidApiHost,
    useQueryString: true,
  });

  return api;
};

const updateNews = (key, category) => {
  const api = createNewsApi(category);

  api.end((response) => {
    if (response.error) {
      console.error("error");
    }

    const values = response.body.items.result;
    setAsync(key, 60 * 5, JSON.stringify(values));
  });
};

export const getNews = async (req, res) => {
  const { category = "TSLA" } = req.query;
  const key = `finance::news::${category}`;

  const values = await getAsync(key);
  if (values) {
    const timeLeft = await getTimeLeft(key);
    if (timeLeft < 30) {
      updateNews(key, category);
    }

    return res.send({ data: JSON.parse(values) });
  }

  const api = createNewsApi(category);
  api.end((response) => {
    if (response.error) {
      next(response.error);
    }

    const values = response.body.items.result;
    setAsync(key, 60 * 5, JSON.stringify(values));

    return res.send({ data: values });
  });
};
