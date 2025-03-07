import { todoApi } from "../api/todos";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../constants/queryKey";

export const useTodoQuery = (id) => {
  const fetchDetail = async () => {
    try {
      const response = await todoApi.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error("fetch detail error : ", error);
    }
  };

  return useQuery({
    queryKey: [QUERY_KEY.TODOS, id],
    queryFn: fetchDetail
  });
};
