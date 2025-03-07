import { todoApi } from "../api/todos";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../constants/queryKey";

export const useTodosQuery = () => {
  const fetchData = async () => {
    const response = await todoApi.get("/todos");
    return response.data;
  };

  return useQuery({
    queryKey: [QUERY_KEY.TODOS],
    queryFn: fetchData
  });
};
