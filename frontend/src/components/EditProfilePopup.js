import { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onSubmit, onCloseClick }) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const currentUser = useContext(CurrentUserContext);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setAbout(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit({ name, about });
  }

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setAbout(currentUser.about);
    }
  }, [isOpen, currentUser]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onCloseClick={onCloseClick}
      onSubmit={handleSubmit}
      form={"form-profile"}
      title={"Редактировать профиль"}
      name={"profile"}
      buttonText={"Сохранить"}
    >
      <input
        className="popup__text popup__text_type_name"
        id="name-input"
        name="nameinput"
        type="text"
        placeholder="Имя"
        pattern=".{2,30}"
        value={name}
        onChange={handleNameChange}
        required
      />
      <span className="popup__error name-input-error" />
      <input
        className="popup__text popup__text_type_about"
        id="about-input"
        name="aboutinput"
        type="text"
        placeholder="О себе"
        pattern=".{2,200}"
        value={about}
        onChange={handleDescriptionChange}
        required
      />
      <span className="popup__error about-input-error" />
    </PopupWithForm>
  );
}
export default EditProfilePopup;
