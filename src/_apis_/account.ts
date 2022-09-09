import { v4 as uuidv4 } from 'uuid';
// utils
import fakeRequest from '../utils/fakeRequest';
import { verify, sign } from '../utils/jwt';
// @types
import { Project } from '../@types/account';
//
import mock from './mock';
import { firstName, lastName } from 'utils/mock-data/name';

// ----------------------------------------------------------------------

const JWT_SECRET = 'minimal-secret-key';
const JWT_EXPIRES_IN = '5 days';

const Projects: Project[] = [
  {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    project_name: 'string',
    project_size: 'string',
    project_start_date: new Date(),
    project_end_date: new Date(),
    working_employees: 'string',
    Manager: 'string',
    displayName: `${firstName} ${lastName}`,
    email: 'demo@minimals.cc',
    password: 'demo1234',
    photoURL: '/static/mock-images/avatars/avatar_default.jpg',
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true
  }
];

// ----------------------------------------------------------------------

mock.onPost('/api/account/login').reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password } = JSON.parse(config.data);
    const Project = Projects.find((_Project) => _Project.email === email);

    if (!Project) {
      return [400, { message: 'There is no Project corresponding to the email address.' }];
    }

    if (Project.password !== password) {
      return [400, { message: 'Wrong password' }];
    }

    const accessToken = sign({ ProjectId: Project.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [200, { accessToken, Project }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onPost('/api/account/register').reply(async (config) => {
  try {
    await fakeRequest(1000);

    const { email, password, firstName, lastName } = JSON.parse(config.data);
    let Project = Projects.find((_Project) => _Project.email === email);

    if (Project) {
      return [400, { message: 'There already exists an account with the given email address.' }];
    }

    Project = {
      project_name: '',
      project_size: '',
      project_start_date: new Date(),
      project_end_date: new Date(),
      working_employees: '',
      Manager: '',
      id: uuidv4(),
      displayName: `${firstName} ${lastName}`,
      email,
      password,
      photoURL: null,
      phoneNumber: null,
      country: null,
      address: null,
      state: null,
      city: null,
      zipCode: null,
      about: null,
      role: 'Project',
      isPublic: true
    };

    const accessToken = sign({ ProjectId: Project.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [200, { accessToken, Project }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});

// ----------------------------------------------------------------------

mock.onGet('/api/account/my-account').reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: 'Authorization token missing' }];
    }

    const accessToken = Authorization.split(' ')[1];
    const data: any = verify(accessToken, JWT_SECRET);
    const ProjectId = typeof data === 'object' ? data?.ProjectId : '';
    const Project = Projects.find((_Project) => _Project.id === ProjectId);

    if (!Project) {
      return [401, { message: 'Invalid authorization token' }];
    }

    return [200, { Project }];
  } catch (error) {
    console.error(error);
    return [500, { message: 'Internal server error' }];
  }
});
