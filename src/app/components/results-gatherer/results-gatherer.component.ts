import { Component, OnInit } from '@angular/core';

import { SpacesMessagesService } from 'spaces-ng';

import { DatastoreService } from '../../services/datastore';

@Component({
    selector: 'results-gatherer',
    templateUrl: './results-gatherer.component.html',
    styleUrls: ['./results-gatherer.component.less']
})
export class ResultsGathererComponent implements OnInit {
    results: any;
    seconds: number = 10;

    constructor(
        public datastore: DatastoreService,
        private messages: SpacesMessagesService
    ) { }

    ngOnInit() {
        this.queryDatastore();
        this.countDown();
    }

    countDown() {
        this.seconds--;
        if (this.seconds <= -1) {
            this.queryDatastore();
            this.seconds = 10;
        }
        setTimeout(() => {
            this.countDown();
        }, 1000);
    }

    queryDatastore() {
        this.datastore.getResults('');
    }

    clearResults() {
        var confirmation = confirm("Are you sure you would like to PERMENENTALLY delete ALL of the results?");
        if (confirmation) {
            for (var i = this.datastore.results.length - 1; i >= 0; i--) {
                this.datastore.delete(this.datastore.results[i].id);
            }
            this.datastore.results = [];
        }
    }

    exportResultsAsCSV() {
        let data: string = "";
        for (var i = this.datastore.results.length - 1; i >= 0; i--) {
            if (i < this.datastore.results.length - 1) {
                data = data + "\n";
            }
            data = data + this.datastore.results[i].name + "," + this.datastore.results[i].message, + "," + this.datastore.results[i].date;
        }
        var blob = new Blob([data], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    exportResultsAsJSON() {
        let data: Array<{
            name: string,
            message: string,
            date: string
        }> = [];
        for (var i = this.datastore.results.length - 1; i >= 0; i--) {
            data.push({
                name: this.datastore.results[i].name,
                message: this.datastore.results[i].message,
                date: this.datastore.results[i].date
            });
        }
        var blob = new Blob([JSON.stringify(data, null, 4)], { type: 'text/json' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

}
