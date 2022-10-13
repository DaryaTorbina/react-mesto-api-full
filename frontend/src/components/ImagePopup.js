function ImagePopup({ card, onCloseClick, onClose }) {
  return (
    <div
      className={`popup popup_zoom" ${card && "popup__open"}`}
      onClick={onCloseClick}
    >
      <div className="popup__container popup__container_zoom">
        <img className="popup__image" src={card?.link} alt={card?.name} />
        <h2 className="popup__description">{card ? card.name : ""}</h2>
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

export default ImagePopup;

