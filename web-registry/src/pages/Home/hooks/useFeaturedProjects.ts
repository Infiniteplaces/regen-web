import { useSortProjects } from 'pages/Projects/hooks/useSortProjects';
import { ProjectWithOrderData } from 'pages/Projects/Projects.types';
import { useProjectsWithOrders } from 'hooks/projects/useProjectsWithOrders';

import { FEATURE_PROJECTS_COUNT, PROJECTS_SORT } from '../Home.constants';

export function useFeaturedProjects(): {
  featuredProjects: ProjectWithOrderData[];
  loading: boolean;
} {
  // get normalized projects with sell order data
  const { projectsWithOrderData, loading } = useProjectsWithOrders({
    limit: FEATURE_PROJECTS_COUNT,
    metadata: true, // to discard projects without metadata prop
  });

  const sortedProjects = useSortProjects({
    projects: projectsWithOrderData,
    sort: PROJECTS_SORT,
  });

  return {
    featuredProjects: sortedProjects,
    loading,
  };
}
