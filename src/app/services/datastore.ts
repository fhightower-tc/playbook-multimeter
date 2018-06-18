import { Injectable } from '@angular/core';

import {
    SpacesLoggingService,
    SpacesMessagesService
} from 'spaces-ng';
import { TcExchangeDbService } from 'threatconnect-ng';

@Injectable()
export class DatastoreService {
    private domain: string = 'organization'
    private typeName: string = 'playbookMultimeter';
    public results: Array<{
        name: string;
        message: string;
        id: string;
        date: string;
    }> = [];

    constructor(
        private exchangeDB: TcExchangeDbService,
        private logging: SpacesLoggingService,
        private messages: SpacesMessagesService
    ) {}

    public getResults(searchCommand: string) {
        this.exchangeDB.read(this.domain, this.typeName, searchCommand, null, '{"size": 10000}')
            .subscribe(
                response => {
                    this.results = [];
                    for (var i = 0; i <= response.hits.hits.length  - 1; i++) {
                        this.results.push({
                            name: response.hits.hits[i]._source.name,
                            message: response.hits.hits[i]._source.message,
                            id: response.hits.hits[i]._id,
                            date: response.hits.hits[i]._source.date
                        });
                    }
                    this.results.sort(function(a: {
                            name: string;
                            message: string;
                            id: string;
                            date: string;
                        }, b: {
                            name: string;
                            message: string;
                            id: string;
                            date: string;
                        }
                    ) {
                        if (a.date === b.date) {
                            return 0;
                        } else if (a.date > b.date) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                },
                err => {
                  this.logging.error('Error', err);
                  this.messages.showError('Failed', 'Unable to retrieve the results from the datastore: ' + err);
                }
            );
    }

    // public save(searchCommand: string, linkName: string, link: string) {
    //     let jsonifiedNoteText = JSON.parse('{"name": "' + linkName + '", "link": "' + link + '"}');

    //     this.exchangeDB.create(this.domain, this.typeName, searchCommand, jsonifiedNoteText)
    //             .subscribe(
    //                 response => {
    //                     this.messages.showSuccess('Success', 'Entry saved');
    //                     // if an entry is being updated, simply update the note's text rather than adding a new entry
    //                     if (searchCommand !== '') {
    //                         // for (var i = this.notes.length - 1; i >= 0; i--) {
    //                         //     if (this.notes[i].id === searchCommand) {
    //                         //         this.notes[i].text = noteText
    //                         //         break;
    //                         //     }
    //                         // }
    //                     } else {
    //                         // this.notes.push({
    //                         //     'text': noteText,
    //                         //     'id': response._id,
    //                         // });
    //                     }
    //                 },
    //                 err => {
    //                     this.logging.error('Error', err);
    //                     this.messages.showError('Failed', 'Unable to save entry in the datastore: ' + err);
    //                 }
    //             );
    // }

    public delete(entryID: string) {
        this.exchangeDB.delete(this.domain, this.typeName, entryID)
                .subscribe(
                    response => {
                        // for (var i = this.notes.length - 1; i >= 0; i--) {
                        //     // remove the note from the list of notes
                        //     if (this.notes[i].id === noteId) {
                        //         this.notes.splice(i, 1);
                        //         break;
                        //     }
                        // }
                    },
                    err => {
                        this.logging.error('Error', err);
                        this.messages.showError('Failed', 'Unable to delete entry from the datastore: ' + err);
                    }
                );
    }
}