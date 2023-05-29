import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileReaderService {
    // eslint-disable-next-line no-unused-vars
    constructor(private http: HttpClient) {}

    readFile(filePath: string): Observable<string> {
        return this.http.get(filePath, { responseType: 'text' });
    }
}
