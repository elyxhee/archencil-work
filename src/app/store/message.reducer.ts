import { createAction, createReducer, on } from '@ngrx/store';

export const addMessage = createAction('[Message] Add');
export const removeMessage = createAction('[Message] Remove', (index: number) => ({ index }));

export interface MessageState {
    counter: number;
    messages: string[];
}

const initialState: MessageState = {
    counter: 0,
    messages: []
};

export const messageReducer = createReducer(
    initialState,
    on(addMessage, (state) => {
        return {
            ...state,
            counter: state.counter + 1,
            messages: [...state.messages, `Hello from NgRx! (${state.counter})`]
        };
    }),
    on(removeMessage, (state, { index }) => {
        return { ...state, messages: state.messages.filter((_, i) => i !== index) };
    })
);
