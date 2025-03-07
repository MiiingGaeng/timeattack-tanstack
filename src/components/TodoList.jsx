import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { todoApi } from "../api/todos";
import { QUERY_KEY } from "../constants/queryKey";
import { useTodosQuery } from "../hooks/useTodosQuery";

export default function TodoList() {
  const navigate = useNavigate();
  // TODO: 선택: useQuery 를 useTodosQuery 커스텀훅으로 정리해 보세요.
  const { data: todos, error, isPending } = useTodosQuery();

  // TODO: 필수: 아래 handleLike 로 구현되어 있는 부분을 useMutation 으로 리팩터링 해보세요. 모든 기능은 동일하게 동작해야 합니다.
  // TODO: 선택: useMutation 으로 리팩터링 후, useTodoMutation 커스텀훅으로 정리해 보세요.
  const queryClient = useQueryClient();

  const updateTodoLike = async ({ id, liked }) => {
    await todoApi.patch(`/todos/${id}`, { liked: !liked });
  };

  const { mutate: likeMutation } = useMutation({
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

  if (isPending) {
    return <div style={{ fontSize: 36 }}>로딩중...</div>;
  }

  if (error) {
    console.error(error);
    return (
      <div style={{ fontSize: 24 }}>에러가 발생했습니다: {error.message}</div>
    );
  }

  return (
    <ul style={{ listStyle: "none", width: 250 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{todo.title}</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => navigate(`/detail/${todo.id}`)}>
              내용보기
            </button>
            {todo.liked ? (
              <FaHeart
                onClick={() => likeMutation({ id: todo.id, liked: todo.liked })}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <FaRegHeart
                onClick={() => likeMutation({ id: todo.id, liked: todo.liked })}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
