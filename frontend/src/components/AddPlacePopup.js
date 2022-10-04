import {useState, useEffect} from "react";
import PopupWithForm from "./PopupWithForm";

function AddMestoPopup({onSubmit, isOpen, onClose, onCloseClick}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleLinkChange(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit({ name, link });
  }

  useEffect(() => {
    if (isOpen) {
      setName("");
      setLink("");
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onCloseClick={onCloseClick}
      onClose={onClose}
      onSubmit={handleSubmit}
      form={"form-mesto"}
      title={"Новое место"}
      name={"mesto"}
      buttonText={"Сохранить"}
    >
      <input
        type="text"
        name="name_mesto_input"
        id="name-mesto-input"
        className="popup__text popup__text_type_name-mesto"
        placeholder="Название"
        pattern=".{2,30}"
        value={name}
        onChange={handleNameChange}
        required
      />
      <span className="popup__error name-mesto-input-error"></span>
      <input
        type="url"
        name="link_mesto_input"
        id="url-mesto-input"
        className="popup__text popup__text_type_link-mesto"
        placeholder="Ссылка на картинку"
        value={link}
        onChange={handleLinkChange}
        required="required"
      />
      <span className="popup__error url-mesto-input-error"></span>
    </PopupWithForm>
  );
}

export default AddMestoPopup;
