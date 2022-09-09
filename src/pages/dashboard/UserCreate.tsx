import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector, RootState } from '../../redux/store';
import { getProjectsList } from '../../redux/slices/project';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProjectNewForm from '../../components/_dashboard/project/ProjectNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const { projectList } = useSelector((state: RootState) => state.project);
  const isEdit = pathname.includes('edit');
  const currentUser = projectList.find((user) => paramCase(user.project_name) === name);

  useEffect(() => {
    dispatch(getProjectsList());
  }, [dispatch]);

  return (
    <Page title="User: Create a new project | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new project' : 'Edit project'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'project', href: PATH_DASHBOARD.project.root },
            { name: !isEdit ? 'New project' : name }
          ]}
        />

        <ProjectNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
