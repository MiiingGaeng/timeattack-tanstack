import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { todoApi } from "../api/todos";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  // TODO: 필수: useMutation 으로 리팩터링 하세요.
  // TODO: 선택: useMutation 으로 리팩터링 후, useTodoMutation 커스텀훅으로 정리해 보세요.
  const queryClient = useQueryClient();
  const addTodo = async () => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      contents,
      createdAt: Date.now()
    };

    await todoApi.post("/todos", newTodo);
  };

  const { mutate: addMutate } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      alert("새로운 할일이 추가되었습니다.");
      queryClient.invalidateQueries(["todos"]);
    }
  });

  return (
    <form onSubmit={addMutate}>
      <label htmlFor="title">제목:</label>
      <input
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="contents">내용:</label>
      <input
        id="contents"
        name="contents"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        required
      />
      <button type="submit">추가하기</button>
    </form>
  );
}
