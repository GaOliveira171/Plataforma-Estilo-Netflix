import styled from 'styled-components';

interface ContainerProps {
  backdrop?: string;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  height: 80vh;
  min-height: 500px;
  max-height: 700px;
  width: 100%;
  background-image: ${props => props.backdrop ? `url(${props.backdrop})` : 'none'};
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  color: var(--white);
  
  @media (max-width: 768px) {
    height: 60vh;
    min-height: 400px;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.5) 60%,
    rgba(0, 0, 0, 0.8) 85%,
    var(--black) 100%
  );
`;

export const Content = styled.div`
  position: absolute;
  bottom: 150px;
  left: 60px;
  max-width: 500px;
  z-index: 10;
  
  @media (max-width: 768px) {
    left: 20px;
    bottom: 100px;
    max-width: 80%;
  }
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Metadata = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const MetadataItem = styled.span`
  margin-right: 15px;
  font-size: 1rem;
  color: #ccc;
  
  &:not(:last-child)::after {
    content: '•';
    margin-left: 15px;
  }
`;

export const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 25px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  color: var(--black);
  border: none;
  border-radius: 4px;
  padding: 10px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  margin-right: 15px;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

export const InfoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(109, 109, 110, 0.7);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 10px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 10px;
  }
  
  &:hover {
    background-color: rgba(109, 109, 110, 0.5);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

