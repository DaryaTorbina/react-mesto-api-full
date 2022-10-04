function PopupWithForm({
  name,
  isOpen,
  onClose,
  form,
  onSubmit,
  title,
  children,
  buttonText,
}) {
  return (
    <div
      className={`popup popup_${name} ${isOpen && `popup__open` }`}
      onClick={onClose}
    >
      <div className="popup__form-container">
        <form className="popup__form" name={form} onSubmit={onSubmit}>
          <h2 className="popup__title">{title}</h2>
          {children}
          <button
            className="popup__button-save"
            type="submit"
            title="Сохранить"
          >
            {buttonText}
          </button>
        </form>
        <button
          className="popup__button-close"
          type="button"
          title="Закрыть"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
export default PopupWithForm;
