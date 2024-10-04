type AllTasksPropTypes = {
  index: number;
  task: {
    id?: number,
    title?: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
  };
  editTask: (index: number) => void;
  deleteTask: (index: number) => void;
};
const AllTasks = (props: AllTasksPropTypes) => {
  return (
    <>
      <b>Title :</b> {props.task.title}
      <br />
      <b>Priority :</b> {props.task.priority}
      <br />
      <b>Completed :</b> {props.task.completed ? "Yes" : "No"}
      <br />
      <button onClick={() => props.editTask(props.task.id!)}>Edit</button>
      <button onClick={() => props.deleteTask(props.task.id!)}>Delete</button>
    </>
  );
};

export default AllTasks;
