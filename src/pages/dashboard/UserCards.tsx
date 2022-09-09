import { useEffect } from 'react';
// material
import { Container, Grid, Skeleton } from '@mui/material';
// redux
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getProjectsList } from '../../redux/slices/project';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { ProjectCard } from '../../components/_dashboard/project/cards';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

export default function UserCards() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { projects } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    dispatch(getProjectsList());
  }, [dispatch]);

  return (
    <Page title="Project: Cards | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Project Cards"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Project', href: PATH_DASHBOARD.project.root },
            { name: 'Cards' }
          ]}
        />
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} item xs={12} sm={6} md={4}>
              <ProjectCard project={project} />
            </Grid>
          ))}

          {!projects.length && SkeletonLoad}
        </Grid>
      </Container>
    </Page>
  );
}
