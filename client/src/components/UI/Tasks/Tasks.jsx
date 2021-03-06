import React, {useState} from 'react';
import "../../../css/tasks.scss"
import "../../../css/common.scss"
import Task from "./Task";
import {NavLink} from "react-router-dom";
import {linksTasks} from "../../constants/constants";
import EditListForm from "../../forms/EditListForm";
import {listsActions} from "../../../redux/reducers/listsReducer";
import {useDispatch} from "react-redux";
import {Counter} from "../../common/Counter";

const Tasks = ({list, tasks, withNavigate}) => {
  const dispatch = useDispatch()
  const [activeLink, setActiveLink] = useState('plan_tasks')
  const listView = (tasks ? tasks : list.tasks).filter(task => task.status === activeLink)

  const valueTasks = (link) => {
    const length = (tasks ? tasks : list.tasks).filter(t => t.status === link.id).length
    return length === 0 ? "" : <Counter count={length}/>
  }

  const handleActiveList = () => {
    dispatch(listsActions.setActiveList(list))
  }

  return (
    <div className="tasks">
      <NavLink onClick={handleActiveList} to={`/lists/${list._id}`}>
        <h2 style={{color: list.color}} className="tasks__title">{list.name}
          {withNavigate && <EditListForm list={list}/>}</h2>
      </NavLink>
      <div className="tasks__nav">
        <ul className="tasks__nav-tabs">
          {linksTasks.map(link => (
            <li className={activeLink === link.id ? "active" : null}
                onClick={() => setActiveLink(link.id)}
                key={link.id}>{link.name}
              {valueTasks(link)}
            </li>
          ))}
        </ul>
      </div>
      <div className="tasks__items">
        {listView && listView.length === 0
          ? <h2 className="emptyTasks">Задачи отсутствуют</h2>
          : listView.map(task => (
            <Task key={`task-${task._id}`}
                  {...task}
                  listId={list._id}/>
          ))
        }
      </div>
    </div>
  );
};

export default Tasks;
