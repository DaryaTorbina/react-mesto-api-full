import React from "react";
// import mestoApiConfig from "../utils/Api";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddMesto,
  cards,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content page__content">
      <section className="profile section content__section section_size-profile_limit">
        <button
          type="button"
          className="profile__avatar-edit"
          aria-label="avatar-edit"
          title="Обновить аватар"
          onClick={onEditAvatar}
        >
          <img
            className="profile__avatar"
            src={currentUser.avatar}
            alt={currentUser.name}
            onClick={onEditAvatar}
          />
        </button>

        <div className="profile__info">
          <div className="profile__edit">
            <div className="profile__content-name">
              <h1 className="profile__name block">{currentUser.name}</h1>
              <button
                type="button"
                className="profile__edit-button"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__about block">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__add-button"
          onClick={onAddMesto}
        ></button>
      </section>

      <section className="elements section content__section">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            link={card.link}
            name={card.name}
            likes={card.likes.length}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}
export default Main;
