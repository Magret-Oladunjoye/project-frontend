import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
import { dispatch } from '../store';
// utils
import axios from 'axios';
//
import { CalendarState } from '../../@types/calendar';

// ----------------------------------------------------------------------

const initialState: CalendarState = {
  isLoading: false,
  error: false,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'calendar',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      const updateEvent = map(state.events, (_event) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });

      state.isLoading = false;
      state.events = updateEvent;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = filter(state.events, (user) => user.id !== eventId);
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

const host = "http://localhost:3001";
export function getEvents() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const user_id = window.localStorage.getItem("user_id");
      console.log(user_id);
      const response = await axios.post(`${host}/shifts/getshifts`, {
        user_id,
      });
  
      const events = response.data.map((event:any)=>{ //converter to sync front and back end
        console.log(event);
        const newEvent = {
          id: event._id,
          title: event.shift_title,
          description: event.shift_description,
          textColor: event.textColor,
          allDay: false,
          start: event.shift_start_date,
          end: event.shift_end_date
        };
        return newEvent;
      })
      console.log("ggfkfof", events, response);
      dispatch(slice.actions.getEventsSuccess(events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent: Omit<EventInput, 'id'>) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(newEvent);
      const shift_id = newEvent.id;
      const shift_title = newEvent.title;
      const shift_description = newEvent.description;
      const shift_start_date = newEvent.start;
      const shift_end_date = newEvent.end;
      const user_id = window.localStorage.getItem("user_id");
      
      console.log(user_id);
      
      const response = await axios.post(`${host}/shifts/newshift`, {
        shift_id,
        user_id,
        shift_title,
        shift_description,
        shift_start_date,
        shift_end_date
      });
      newEvent.id=response.data._id;
      dispatch(slice.actions.createEventSuccess(newEvent));
      
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(
  _id: string,
  updateEvent: Partial<{
    title: string;
    description: string;
    allDay: boolean;
    start: Date | null;
    end: Date | null;
  }>
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const shift_title = updateEvent.title;
      const shift_description = updateEvent.description;
      const shift_start_date = updateEvent.start;
      const shift_end_date = updateEvent.end;
      const response = await axios.patch(`${host}/shifts/${_id}`, {
        shift_title,
        shift_description,
        shift_start_date,
        shift_end_date
      });
      dispatch(slice.actions.updateEventSuccess(updateEvent));
      dispatch(getEvents());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(_id:string) {

  return async () => {
    dispatch(slice.actions.startLoading());
    dispatch(getEvents()); 
    try {
      await axios.delete(`${host}/shifts/${_id}`);
      console.log(_id);
      dispatch(slice.actions.deleteEventSuccess({_id}));
      dispatch(getEvents());   
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function selectRange(start: Date, end: Date) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
}
