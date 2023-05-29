import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addMessage, removeMessage } from '../../../store/message.reducer';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-test-ngrx',
    templateUrl: './test-ngrx.component.html',
    styleUrls: ['./test-ngrx.component.scss']
})
export class TestNgRxComponent {
    messages$: Observable<string[]>;

    // eslint-disable-next-line no-unused-vars
    constructor(private store: Store) {
        this.messages$ = this.store.select((state: any) => state.messageState.messages);
    }

    addMessage() {
        console.log('Adding message');
        this.store.dispatch(addMessage());
    }

    removeMessage(index: number) {
        console.log('Removing message at index', index);
        this.store.dispatch(removeMessage(index));
    }
}
