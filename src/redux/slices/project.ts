import { filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
// utils
import axios from 'axios';
import {
  ProjectManager,
  ProjectData
} from '../../@types/project';
import { EventInput } from '@fullcalendar/common';
// ----------------------------------------------------------------------

type projectsState = {
  isLoading: boolean;
  error: boolean;
  projects: ProjectData[];
  projectList: ProjectManager[];
};

const initialState: projectsState = {
  isLoading: false,
  error: false,
  projects: [],
  projectList: [],
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET projectsS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.projects = action.payload;
    },

    // DELETE projectsS
    deleteProject(state, action) {
      const deleteProject = filter(state.projectList, (projects) => projects.id !== action.payload);
      state.projectList = deleteProject;
    },

    // GET MANAGE projectsS
    getprojectsListSuccess(state, action) {
      state.isLoading = false;
      state.projectList = action.payload;
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { deleteProject } = slice.actions;

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------


const host = "http://localhost:3001";
export function getProjectsList() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const user_id = window.localStorage.getItem("user_id");
      console.log(user_id);
      const response = await axios.post(`${host}/project/newproject`, {
        user_id,
      });
  
      const events = response.data.map((event:any)=>{ //converter to sync front and back end
        console.log(event);
        const newProject = {
          project_id: event.Project_id,
          project_name: event.Project_Name,
          project_description: event.Project_Size,
          project_start_date: event.Project_Start_Date,
          project_end_date: event.Project_End_Date,
          working_employees: event.Working_Employees,
          manager: event.Manager
        };
        return newProject;
      })
      console.log("get projects", events, response);
      dispatch(slice.actions.getprojectsListSuccess(events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function createProject(newProject: Omit<EventInput, 'project_id'>) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(newProject);
      const project_id = newProject.project_id;
      const project_name = newProject.project_name;
      const project_size = newProject.project_size;
      const project_start_date = newProject.project_start_date;
      const project_end_date = newProject.project_end_date;
      const working_employees = newProject.working_employees;
      const manager = newProject.manager;

      
      console.log(project_id);
      
      const response = await axios.post(`${host}/project/newproject`, {
        project_name,
        project_size,
        project_start_date,
        project_end_date,
        working_employees,
        manager
      });
      newProject.project_id=response.data.Project_id;
      dispatch(slice.actions.getprojectsListSuccess(newProject));    
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

