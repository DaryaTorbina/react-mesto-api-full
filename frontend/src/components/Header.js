import logo from "../images/header/logo.svg";
import { Link } from "react-router-dom";

function Header({ title, route, mail, onClick }) { // без props.
  return (
    <header className="header section page__header">
      <img className="header__logo" src={logo} alt="логотип Место Россия" />
      <nav className="header__data">
        <p className="header__text">{mail}</p>
        <Link
          to={route}
          className="header__link"
          type="button"
          onClick={onClick}
        >
          {title}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
