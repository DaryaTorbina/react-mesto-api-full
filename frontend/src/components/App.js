import React, { useEffect, useState } from "react";//
import mestoApiConfig from "../utils/Api";//
import * as auth from "../utils/Auth";//
import Header from "./Header";//
import Main from "./Main";//
import Footer from "./Footer";//
import ImagePopup from "./ImagePopup";//
import { CurrentUserContext } from "../contexts/CurrentUserContext";//
import EditProfilePopup from "./EditProfilePopup";//
import AddPlacePopup from "./AddPlacePopup";//
import EditAvatarPopup from "./EditAvatarPopup";//

import Login from "./Login";//
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  withRouter,
} from "react-router-dom";//
import InfoTooltip from "./InfoTooltip";//
import Register from "./Register";//
//import { register, login, getToken } from "../utils/Auth";
import ProtectedRoute from "./ProtectedRoute";//
import picSuccess from "../images/message/ok.png";//
import picFail from "../images/message/fail.png";//


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

//deliteMestopopup

 useEffect(() => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    auth.getToken(jwt)
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setEmail(res.user.email);
        }
      })
      .catch((err) => {
        console.log(`Не удалось получить токен: ${err}`);
      })
  }
}, []);

useEffect(() => {
  if (isLoggedIn === true) {
    history.push("/");
  }
}, [isLoggedIn, history]);

function onRegister(email, password) {
  auth.register(email, password)
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


function onLogin(email, password) {
  auth
    .login(password, email)
    .then((data) => {
      if (data) {
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        setEmail(email);
        history.push("/");
      }
    })
    .catch((err) => {
      closeAllPopups();
        setMessageImage(picFail);
        setMessageText("Что-то пошло не так! Попробуйте ещё раз.Неправильная почта или пароль.");
        openInfoTooltip();
    });
}
useEffect(() => {
  if (isLoggedIn === true) {
    Promise.all([mestoApiConfig.getUserInfo(), mestoApiConfig.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user.user);
        setCards(cards.reverse());
      })
      .catch(() => {
        closeAllPopups();
        setMessageImage(picFail);
        setMessageText("Что-то пошло не так! Ошибка авторизации.");
        openInfoTooltip();
      });
  }
}, [isLoggedIn]);



  function handleUserUpdate(data) {//
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

  function handleAvatarUpdate(data) {//
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

  function handleAddMestoSubmit(data) {//
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

  function handleCardDelete(card) {//
    mestoApiConfig
      .removeMesto(card._id)
      .then(() => {
        setCards(cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {//
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

  function handleEditAvatarClick() {//
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {//
    setIsEditProfilePopupOpen(true);
  }

  function handleAddMestoClick() {//
    setIsAddMestoPopupOpen(true);
  }

  function handleCardClick(card) {//
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

  function handlePopupCloseClick(evt) {//
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
  function openInfoTooltip() {//
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
            <Route path="/signin">
              <>
                <Header title="Регистрация" route="/signup" />
                <Login onLogin={onLogin} />
              </>
            </Route>

            <Route path="/signup">
              <>
                <Header title="Войти" route="/signin" />
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
            onCloseClick={handlePopupCloseClick} 
            onClose={closeAllPopups}
            onSubmit={handleUserUpdate}
          />

          <AddPlacePopup
            isOpen={isAddMestoPopupOpen}
             onClose={closeAllPopups}
             onCloseClick={handlePopupCloseClick}
            onSubmit={handleAddMestoSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
          onCloseClick={handlePopupCloseClick}
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
