import { QUERY_KEY } from "../constants/queryKey";
import { todoApi } from "../api/todos";
import { useQuery } from "@tanstack/react-query";

export const useTodosQuery = () => {
  const fetchTodosData = async () => {
    try {
      const response = await todoApi.get("/todos");
      return response.data;
    } catch (err) {
      console.err("fetch todoData error : ", err);
    }
  };

  return useQuery({
    queryKey: [QUERY_KEY.TODOS],
    queryFn: fetchTodosData
  });
};
