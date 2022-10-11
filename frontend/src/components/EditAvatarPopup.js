import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ onSubmit, onClose, isOpen,onCloseClick }) {
  const ref = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmit({
      avatar_link: ref.current.value,
    });
  }

  React.useEffect(() => {
    ref.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onCloseClick={onCloseClick}
      onSubmit={handleSubmit}
      form={"form-newAvatar"}
      title={"Обновить аватар"}
      name={"newavatar"}
      buttonText={"Сохранить"}
    >
      <input
        ref={ref}
        type="url"
        name="urlavatar"
        className="popup__text"
        id="url-avatarLink-input"
        required
        placeholder="Ссылка на фото"
      />
      <span className="popup__text_type_error url-avatarLink-input-error" />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
