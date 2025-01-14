import { Box } from '@mui/material';

import ProjectCard from 'web-components/lib/components/cards/ProjectCard';
import Section from 'web-components/lib/components/section';

import { ProjectWithOrderData } from 'pages/Projects/Projects.types';
import WithLoader from 'components/atoms/WithLoader';

import { API_URI, IMAGE_STORAGE_BASE_URL } from './ProjectCardsSection.config';
import { useSectionStyles } from './ProjectCardsSection.styles';
import { ProjectCardOnButtonClickParams } from './ProjectCardsSection.types';

interface Props {
  projects: ProjectWithOrderData[];
  title?: string;
  titleAlign?: 'center' | 'left';
  onButtonClick?: (params: ProjectCardOnButtonClickParams) => void;
  loading?: boolean;
}

export function ProjectCardsSection({
  projects,
  title = 'Projects',
  titleAlign = 'center',
  onButtonClick,
  loading,
}: Props): JSX.Element {
  const { classes } = useSectionStyles();

  return (
    <Section
      title={title}
      titleAlign={titleAlign}
      classes={{ root: classes.section, title: classes.title }}
    >
      <WithLoader
        isLoading={!!loading}
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))',
            gridGap: '1.125rem',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {projects?.map(project => (
            <Box key={project.id}>
              <ProjectCard
                id={project.id}
                name={project.name}
                creditClassId={project.creditClassId}
                imgSrc={project.imgSrc}
                place={project.place}
                area={project.area}
                areaUnit={project.areaUnit}
                onButtonClick={
                  onButtonClick && (() => onButtonClick({ project }))
                }
                purchaseInfo={project.purchaseInfo}
                href={`/projects/${project.id}`}
                target={'_self'}
                imageStorageBaseUrl={IMAGE_STORAGE_BASE_URL}
                apiServerUrl={API_URI}
                truncateTitle={true}
                sx={{ width: 400, height: 479 }}
              />
            </Box>
          ))}
        </Box>
      </WithLoader>
    </Section>
  );
}
