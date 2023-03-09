import { useLocation } from "react-router-dom";

export const QueryParams = (queryString) => {
  const search = useLocation().search;
const result = new URLSearchParams(search).get(queryString);
return result;
}