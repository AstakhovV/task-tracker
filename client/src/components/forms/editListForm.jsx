import React, {useRef, useState} from 'react';
import '../../css/editListForm.scss';
import imgClose from "../../assets/img/close.svg";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {editListName, listsActions} from "../../redux/reducers/listsReducer";
import Button from "../common/Button";
import {useForm} from "../hooks/useForm";
import TextField from "../common/textField";
import {useOutsideAlerter} from "../hooks/useOutsideAlerter";
import editImg from "../../assets/img/edit.svg";

const EditListForm = ({list}) => {
  const wrapperRef = useRef(null);
  const dispatch = useDispatch()
  const {form, handleChange} = useForm()
  const [hiddenPopup, setHiddenPopup] = useState(false)
  const isLoading = useSelector(state => state.lists.isLoading.editNameList)

  const onClose = () => {
    setHiddenPopup(false)
    handleChange({name: "categoryName", value: ''})
  }
  useOutsideAlerter(wrapperRef, onClose)
  const editTitle = () => {
    if (!form.categoryName) {
      toast.info('Введите название списка!')
      return
    }
    dispatch(editListName(list.id, form.categoryName, onClose))
    dispatch(listsActions.setActiveList({id: list.id}))

  }

  return (
    <div ref={wrapperRef} className="edit__list">
      <img onClick={isLoading ? null : () => setHiddenPopup(!hiddenPopup)} src={editImg} alt="edit"/>
      {hiddenPopup &&
      <div className="edit__list-popup">
        <img src={imgClose} onClick={onClose} alt="Close" className="edit__list-popup-close-btn"/>
        <TextField name="categoryName"
                   onChange={handleChange}
                   value={form.categoryName?.substring(0, 20) || list.name}
                   placeholder="Название категории"/>
        <Button onClick={editTitle} name="Изменить" disabled={isLoading}/>
      </div>
      }
    </div>
  );
};

export default EditListForm;
