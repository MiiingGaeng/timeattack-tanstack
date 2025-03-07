import { useQueryClient, useMutation } from "@tanstack/react-query";
import { todoApi } from "../api/todos";
import { QUERY_KEY } from "../constants/queryKey";

export const useTodoMutation = () => {
  const queryClient = useQueryClient();

  const updateTodoLike = async ({ id, liked }) => {
    await todoApi.patch(`/todos/${id}`, { liked: !liked });
  };

  return useMutation({
    mutationFn: updateTodoLike,
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries([QUERY_KEY.TODOS, id]);
      const prevTodo = queryClient.getQueryData([QUERY_KEY.TODOS, id]);

      const updatedTodo = { ...prevTodo, liked: !liked };

      queryClient.setQueryData([QUERY_KEY.TODOS, id], updatedTodo);

      return { prevTodo };
    },
    onError: (error, _, context) => {
      console.error("liked error : ", error);
      queryClient.setQueryData(context.prevTodo);
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEY.TODOS]);
    }
  });
};
