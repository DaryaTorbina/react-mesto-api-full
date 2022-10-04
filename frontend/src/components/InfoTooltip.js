import React from "react";

function InfoTooltip({isOpen, onClose, image, text}) {
  return (
    <div
      className={`popup ${isOpen && "popup__open" }`}
      onClick={onClose}
    >
      <div className="popup__form-container popup__info-status">
        <img className="popup__status" src={image} alt={text} />
        <h2 className="popup__status-message">{text}</h2>
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

export default InfoTooltip;
