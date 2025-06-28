import styled from 'styled-components';

interface ContainerProps {
  isScrolled: boolean;
}

interface NavItemProps {
  active?: boolean;
}

export const Container = styled.header<ContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 60px;
  background-color: ${props => props.isScrolled ? 'var(--black)' : 'transparent'};
  background-image: ${props => props.isScrolled ? 'none' : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 10%, transparent)'};
  transition: background-color 0.3s ease;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary);
  margin-right: 40px;
  
  a {
    color: var(--primary);
    text-decoration: none;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.div<NavItemProps>`
  margin-right: 20px;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
  
  a {
    color: var(--white);
    text-decoration: none;
  }
`;

export const RightContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  position: relative;
  
  svg {
    font-size: 1.2rem;
    cursor: pointer;
  }
`;

export const SearchInput = styled.input`
  background-color: var(--black);
  border: 1px solid var(--white);
  color: var(--white);
  padding: 5px 10px;
  width: 250px;
  height: 36px;
  outline: none;
  
  &::placeholder {
    color: var(--light-gray);
  }
`;

export const NotificationIcon = styled.div`
  margin-right: 20px;
  font-size: 1.2rem;
  cursor: pointer;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  
  svg {
    margin-left: 5px;
    font-size: 0.8rem;
  }
`;

export const ProfileImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #808080;
  background-image: url('https://occ-0-1723-1722.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41');
  background-size: cover;
`;

export const ProfileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  width: 180px;
  overflow: hidden;
  z-index: 1000;
`;

export const ProfileMenuItem = styled.div`
  padding: 10px 15px;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--medium-gray);
  }
  
  a {
    display: block;
    width: 100%;
  }
`;

