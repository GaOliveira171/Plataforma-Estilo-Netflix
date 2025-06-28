import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaCaretDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Logo,
  Navigation,
  NavItem,
  RightContainer,
  SearchContainer,
  SearchInput,
  ProfileContainer,
  ProfileMenu,
  ProfileMenuItem,
  NotificationIcon,
  ProfileImage
} from './styles';

const Header: React.FC = () => {
  const { signed, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  // Detectar scroll para mudar a cor do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (!target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
      
      if (!target.closest('.search-container')) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fechar menus ao mudar de página
  useEffect(() => {
    setShowProfileMenu(false);
    setShowSearch(false);
  }, [location]);

  return (
    <Container isScrolled={isScrolled}>
      <Logo>
        <Link to="/">NETFLIX</Link>
      </Logo>

      {signed && (
        <Navigation>
          <NavItem active={location.pathname === '/'}>
            <Link to="/">Início</Link>
          </NavItem>
          <NavItem active={location.pathname === '/series'}>
            <Link to="/series">Séries</Link>
          </NavItem>
          <NavItem active={location.pathname === '/movies'}>
            <Link to="/movies">Filmes</Link>
          </NavItem>
          <NavItem active={location.pathname === '/latest'}>
            <Link to="/latest">Novidades</Link>
          </NavItem>
          <NavItem active={location.pathname === '/my-list'}>
            <Link to="/my-list">Minha Lista</Link>
          </NavItem>
        </Navigation>
      )}

      <RightContainer>
        {signed ? (
          <>
            <SearchContainer className="search-container">
              {showSearch ? (
                <SearchInput
                  type="text"
                  placeholder="Títulos, pessoas, gêneros"
                  autoFocus
                />
              ) : (
                <FaSearch onClick={() => setShowSearch(true)} />
              )}
            </SearchContainer>

            <NotificationIcon>
              <FaBell />
            </NotificationIcon>

            <ProfileContainer 
              className="profile-container"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <ProfileImage />
              <FaCaretDown />

              {showProfileMenu && (
                <ProfileMenu>
                  <ProfileMenuItem>
                    <Link to="/profile">Perfil</Link>
                  </ProfileMenuItem>
                  <ProfileMenuItem>
                    <Link to="/account">Conta</Link>
                  </ProfileMenuItem>
                  <ProfileMenuItem>
                    <Link to="/help">Ajuda</Link>
                  </ProfileMenuItem>
                  <ProfileMenuItem onClick={logout}>
                    Sair
                  </ProfileMenuItem>
                </ProfileMenu>
              )}
            </ProfileContainer>
          </>
        ) : (
          <>
            <NavItem>
              <Link to="/login">Entrar</Link>
            </NavItem>
            <NavItem>
              <Link to="/register">Cadastrar</Link>
            </NavItem>
          </>
        )}
      </RightContainer>
    </Container>
  );
};

export default Header;

