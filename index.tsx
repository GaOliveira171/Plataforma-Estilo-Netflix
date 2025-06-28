import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import { Content } from '../../services/content';
import {
  Container,
  Overlay,
  Content as ContentContainer,
  Title,
  Description,
  Buttons,
  PlayButton,
  InfoButton,
  Metadata,
  MetadataItem
} from './styles';

interface BannerProps {
  content: Content;
}

const Banner: React.FC<BannerProps> = ({ content }) => {
  // Truncar descrição se for muito longa
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <Container backdrop={content.backdrop}>
      <Overlay />
      <ContentContainer>
        <Title>{content.title}</Title>
        <Metadata>
          <MetadataItem>{new Date(content.release_date).getFullYear()}</MetadataItem>
          <MetadataItem>{content.rating}</MetadataItem>
          <MetadataItem>{content.duration} min</MetadataItem>
        </Metadata>
        <Description>{truncate(content.description, 150)}</Description>
        <Buttons>
          <PlayButton as={Link} to={`/watch/${content.id}`}>
            <FaPlay />
            Assistir
          </PlayButton>
          <InfoButton as={Link} to={`/content/${content.id}`}>
            <FaInfoCircle />
            Mais informações
          </InfoButton>
        </Buttons>
      </ContentContainer>
    </Container>
  );
};

export default Banner;

