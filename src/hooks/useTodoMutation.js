import { todoApi } from "../api/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTodoMutation = (title, contents) => {
  //queryClient
  const queryClient = useQueryClient();

  //할일 추가 로직
  const addTodo = async () => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      contents,
      createdAt: Date.now()
    };

    await todoApi.post("/todos", newTodo);
  };

  return useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      alert("새로운 할일이 추가되었습니다.");
      queryClient.invalidateQueries(["todos"]);
    }
  });
};
