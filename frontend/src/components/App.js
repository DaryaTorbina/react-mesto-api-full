import React, { useEffect, useState } from "react";
import mestoApiConfig from "../utils/Api";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
//import PopupWithForm from "./PopupWithForm";
import Login from "./Login";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  withRouter,
} from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import Register from "./Register";
import { register, login, getToken } from "../utils/Auth";
import ProtectedRoute from "./ProtectedRoute";
import picSuccess from "../images/message/ok.png";
import picFail from "../images/message/fail.png";

function App() {
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddMestoPopupOpen, setIsAddMestoPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isZoomPopupOpen, setIsZoomPopupOpen] = useState(false);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [MessageImage, setMessageImage] = useState("");
  const [MessageText, setMessageText] = useState("");

  const history = useHistory();

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    Promise.all([
      mestoApiConfig.getUserInfo(),
      mestoApiConfig.getInitialCards(),
    ])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (token) {
      return getToken(token)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setEmail(res.data.email);
          } else {
            localStorage.removeItem("jwt");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      localStorage.removeItem("jwt");
    }
  }, []);

  useEffect(() => {
    if (token) {
      history.push("/");
    }
  }, [history, isLoggedIn]);

  function handleUserUpdate(data) {
    mestoApiConfig
      .updateUserInfo(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAvatarUpdate(data) {
    mestoApiConfig
      .updateProfileAvatar(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAddMestoSubmit(data) {
    mestoApiConfig
      .addNewMesto(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleCardDelete(card) {
    mestoApiConfig
      .removeMesto(card._id)
      .then(() => {
        setCards(cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    mestoApiConfig
      .changeLikeCard(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function onRegister(email, password) {
    return register(email, password)
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setMessageImage(picSuccess);
          setMessageText("Вы успешно зарегистрировались!");
          openInfoTooltip();
          history.push("/sign-in");
        } else {
          setIsLoggedIn(false);
          setMessageImage(picFail);
          setMessageText("Что-то пошло не так! Попробуйте ещё раз.");
          openInfoTooltip();
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setMessageImage(picFail);
        setMessageText("Что-то пошло не так! Попробуйте ещё раз.");
        openInfoTooltip();
        history.push("/sign-up");
      });
  }
  const AUTHORIZATION_ERROR_CODE = 401;
  function onLogin(email, password) {
    return login(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setIsLoggedIn(true);
          setEmail(email);
          history.push("/");
        } else {
          setIsLoggedIn(false);
          setMessageImage(picFail);
          setMessageText("Что-то пошло не так! Попробуйте ещё раз.");
          openInfoTooltip();
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setMessageImage(picFail);
        setMessageText("Что-то пошло не так! Попробуйте ещё раз.");
        openInfoTooltip();
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddMestoClick() {
    setIsAddMestoPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsZoomPopupOpen(true);
  }

  function closeAllPopups() {
    setIsProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddMestoPopupOpen(false);
    setSelectedCard(null);
    setIsTooltipOpen(false);
    setIsZoomPopupOpen(false);
  }

  function handlePopupCloseClick(evt) {
    if (evt.target.classList.contains("popup__open")) {
      closeAllPopups();
    }
  }

  function onSignOut() {
    setIsLoggedIn(false);
    setEmail(null);
    history.push("/sign-in");
    localStorage.removeItem("jwt");
  }
  function openInfoTooltip() {
    setIsTooltipOpen(true);
  }

  useEffect(() => {
    if (
      isProfilePopupOpen ||
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddMestoPopupOpen ||
      selectedCard ||
      isTooltipOpen
    ) {
      function handleEsc(evt) {
        if (evt.key === "Escape") {
          closeAllPopups();
        }
      }

      document.addEventListener("keydown", handleEsc);

      return () => {
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [
    isProfilePopupOpen,
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddMestoPopupOpen,
    selectedCard,
    isTooltipOpen,
  ]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Switch>
            <Route path="/sign-in">
              <>
                <Header title="Регистрация" route="/sign-up" />
                <Login onLogin={onLogin} />
              </>
            </Route>

            <Route path="/sign-up">
              <>
                <Header title="Войти" route="/sign-in" />
                <Register onRegister={onRegister} />
              </>
            </Route>

            <Route exact path="/">
              <>
                <Header
                  title="Выйти"
                  mail={email}
                  route=""
                  onClick={onSignOut}
                />

                <ProtectedRoute
                  component={Main}
                  isLogged={isLoggedIn}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddMesto={handleAddMestoClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  on
                />

                <Footer />
              </>
            </Route>
            <Route path="*">
              <Redirect to={isLoggedIn ? "/" : "/sign-in"} />
            </Route>
          </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleUserUpdate}
          />

          <AddPlacePopup
            isOpen={isAddMestoPopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleAddMestoSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleAvatarUpdate}
          />

          <ImagePopup
            card={selectedCard}
            isOpen={isZoomPopupOpen}
            onClose={closeAllPopups}
            onCloseClick={handlePopupCloseClick}
          />

          <InfoTooltip
            image={MessageImage}
            text={MessageText}
            isOpen={isTooltipOpen}
            onClose={closeAllPopups}
          />
        </div>

        <div className="popup popup_confirmation">
          <div className="popup__form-container popup__container_confirmation">
            <form name="confirmationDelet" className="popup__form">
              <p className="popup__title popup__title_confirmation">
                Вы уверены?
              </p>
              <button
                type="submit"
                className="popup__button-save popup__button-save_confirmation"
              >
                Да
              </button>
              <button
                type="button"
                className="popup__button-close"
                aria-label="close"
              ></button>
            </form>
          </div>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
